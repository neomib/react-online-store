import { firebaseService } from "./firebase.service";

const ProductsCol = 'products';
const CategoriesDoc = 'categoriesDoc';

export interface Category
{
    name: string,
    subCategories: string[]
}

class DataService
{
    private categories: { [key: string]: Category } = {};
    private categoriesNum = 0;

    getCategory(categoryId: string)
    {
        return this.categories[categoryId];
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
                }
            });
    }
    addCategory(categoryName: string, parentId?: string)
    {
        let categoryId = parentId ? parentId + this.categoriesNum : this.categoriesNum + '';
        let categories: { [key: string]: any } = {};
        categories[categoryId] = { name: categoryName, subCategories: [] };

        if (parentId)
        {
            let parentCategory = this.categories[parentId];
            parentCategory.subCategories.push(categoryId);
            categories[parentId + '.subCategories'] = parentCategory.subCategories;
        }

        return firebaseService.setDoc(ProductsCol, CategoriesDoc, categories)
        .then(response=>Promise.resolve(categoryId))
        .catch(()=>{});
    }

    getSubCategories(categoryNum: number)
    {
        let category = this.categories[categoryNum];
        if (category)
            return category.subCategories;
        return {};
    }
}
export let dataService = new DataService();