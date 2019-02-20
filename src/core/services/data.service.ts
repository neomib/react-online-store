import { firebaseService } from "./firebase.service";
import { computed, observable, action } from 'mobx';

const ProductsCol = 'products';
const CategoriesDoc = 'categoriesDoc';

export interface Category
{
    name: string,
    subCategories: string[],
    level: number,
    color?:string
}

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
                });
        }
    }
    addCategory(category: {name:string,color?:string}, parentId?: string)
    {
        let categoryId = parentId ? parentId + this.categoriesNum : this.categoriesNum + '';
        let categories: { [key: string]: any } = {};
        categories[categoryId] = { name: category.name, subCategories: [], level: 1,color:category.color };

        if (parentId)
        {
            let parentCategory = this.categories[parentId];
            categories[categoryId].level = parentCategory.level + 1;
            parentCategory.subCategories.push(categoryId);
            categories[parentId + '.subCategories'] = parentCategory.subCategories;
        }

        return firebaseService.setDoc(ProductsCol, CategoriesDoc, categories)
            .then(response => Promise.resolve(categoryId))
            .catch(() => { });
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
}
export let dataService = new DataService();