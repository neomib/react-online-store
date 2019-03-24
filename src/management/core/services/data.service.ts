import { firebaseService } from "./firebase.service";
import { computed, observable, action } from 'mobx';
import { ProductsCol, CategoriesDoc } from "../constants";
import { Category, Items } from "../entities";

class DataService
{
    @observable private categories: { [key: string]: Category } = {};
    @observable private firstLevelCategoryList: string[] = [];
    private categoriesNum = 0;

    getCategory(categoryId: string)
    {
        return this.categories[categoryId];
    }
    get firstLevelCategories()
    {
        return this.firstLevelCategoryList;
    }
    retrieveCategories()
    {
        if (Object.keys(this.categories).length <= 0)
        {
            firebaseService.subscribeToDocData(ProductsCol, CategoriesDoc,
                (categories) =>
                {
                    if (categories)
                    {
                        this.categoriesNum = Object.keys(categories).length;
                        this.categories = categories;
                        this.setParentCategories();
                    }
                    else
                    {
                        firebaseService.setDoc(ProductsCol, CategoriesDoc, {});
                    }
                });
        }
    }
    addCategory(category: { name: string, color?: string }, parentId?: string)
    {
        let categoryId = parentId ? parentId + this.categoriesNum : this.categoriesNum + '';
        this.categories[categoryId] = { name: category.name, subCategories: [], level: 1, color: category.color };
        let updateObj: { [key: string]: Category } = {};
        updateObj[categoryId] = this.categories[categoryId];
        if (parentId)
        {
            let parentCategory = this.categories[parentId];
            this.categories[categoryId].level = parentCategory.level + 1;
            parentCategory.subCategories.push(categoryId);
            updateObj[parentId] = parentCategory;
        }

        return firebaseService.setDoc(ProductsCol, CategoriesDoc, updateObj)
            .then(response => Promise.resolve(categoryId))
            .catch(() => { });
    }

    deleteCategory(categoryId: string, parentId: string)
    {
        delete this.categories[categoryId];
        firebaseService.deleteField(ProductsCol, CategoriesDoc, categoryId);
        if (parentId)
        {
            let parentCategory = this.categories[parentId];
            let updateObj: { [key: string]: Category } = {};
            parentCategory.subCategories = parentCategory.subCategories.filter(sub => sub != categoryId);
            updateObj[parentId]=parentCategory;
            firebaseService.updateDoc(ProductsCol, CategoriesDoc, updateObj);
        }
    }

    getSubCategories(categoryNum: string)
    {
        let category = this.categories[categoryNum];
        if (category)
            return category.subCategories;
        return [];
    }
    setParentCategories()
    {
        this.firstLevelCategoryList = Object.keys(this.categories).filter(categoryNum => this.categories[categoryNum].level === 1);
    }

    retrieveItems(categoryId:string,callback:(items:Items)=>void)
    {
        firebaseService.getDocumentByQuery();
    }
}
export let dataService = new DataService();