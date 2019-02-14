import { firebaseService } from "./firebase.service";

const ProductsCol = 'products';
const CategoriesDoc = 'categoriesDoc';

export interface Category
{
    name: string,
    subCategories: string[],
    level: number
}

class DataService
{
    private categories: { [key: string]: Category } = {};
    private firstLevelCategoryList: string[] = [];
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
    addCategory(categoryName: string, parentId?: string)
    {
        let categoryId = parentId ? parentId + this.categoriesNum : this.categoriesNum + '';
        let categories: { [key: string]: any } = {};
        categories[categoryId] = { name: categoryName, subCategories: [], level: 1 };

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