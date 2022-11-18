import db from "$Database"
import svelteCMS from "$svelteCMS"
import { error } from "@sveltejs/kit"
// @ts-ignore
import type { PageServerLoad } from "./$Types"
import type { CategoryData } from "$Types"

export const load:PageServerLoad = async({params})=>{
    const { routeID, categorySlug } = params
    const collectionName = svelteCMS.config.rcn
    const routesCollection = db.collection(collectionName)
    const routeDataDB = await routesCollection.findOne({ID:routeID})
    // Check if route ID exists
    if(!routeDataDB) throw error(404,`Route:${routeID} do not exists`)
    // Else if it exists, check if category exists
    const categoriesCollectionName = `${svelteCMS.config.ccb}_${routeID}`
    const categoriesCollection = db.collection(categoriesCollectionName)
    const categoryDB:any = await categoriesCollection.findOne({slug:categorySlug})
    // If category do not exists
    if(!categoryDB) throw error(404,`Category:${categorySlug} do not exists`)
    // Else return category
    categoryDB['_id'] = categoryDB['_id'].toString()
    const category:CategoryData = categoryDB
    return { category,routeID }
}