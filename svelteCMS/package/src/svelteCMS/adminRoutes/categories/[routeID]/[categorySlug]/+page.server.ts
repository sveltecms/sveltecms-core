import cms from "$Cms"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { CategoryData } from "$Types"

export const load:PageServerLoad = async({params})=>{
    const { routeID, categorySlug } = params
    const routeData = await cms.Fetch.route({ID:routeID})
    // Check if route ID exists
    if(!routeData) throw error(404,`Route:${routeID} do not exists`)
    // Else if it exists, check if category exists
    const categoryData:any = await cms.Fetch.category({slug:categorySlug,routeID})
    // If category do not exists
    if(!categoryData) throw error(404,`Category:${categorySlug} do not exists`)
    // Else return category
    categoryData['_id'] = categoryData['_id'].toString()
    const category:CategoryData = categoryData
    return { category,routeID }
}