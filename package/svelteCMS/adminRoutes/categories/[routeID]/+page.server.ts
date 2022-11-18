import db from "$Database"
import svelteCMS from "$svelteCMS"
import { CategoriesRoutes } from "$Stores"
import { getStoreData2 } from "$Utils"
import type { CategoryData } from "$Types"
// @ts-ignore
import type { PageServerLoad } from "./$Types"
import { error } from "@sveltejs/kit"

export const load:PageServerLoad = async({params})=>{
    const routeID = params.routeID
    const categoryExists:string[] = await getStoreData2(CategoriesRoutes)
    // Check if category ID exists
    if(!categoryExists.includes(routeID)) throw error(404,`Categories for route:${routeID} do not exists`)
    // Else if it exists, return categories list
    const collection = db.collection(`${svelteCMS.config.categoriesCollectionBase}_${routeID}`)
    // @ts-ignore
    const categoriesDB:any = await collection.find({}).limit(20).map(data=>{data['_id']=data['_id'].toString();return data}).toArray()
    const categories:CategoryData[] = categoriesDB
    return { categories,routeID }
}