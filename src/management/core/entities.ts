export interface Category
{
    name: string,
    subCategories: string[],
    level: number,
    color?: string
}
export type Items = { [key: string]: Item }
export interface Item
{
    id: number,
    name: string,
    price: number,
    amount: number,
    imgData?: string,
    description?: string,
    categoryId:string
}