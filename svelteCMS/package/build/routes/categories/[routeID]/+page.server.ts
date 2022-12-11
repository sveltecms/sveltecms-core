import cms from "$Cms"
import svelteCMS from "$svelteCMS"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

export const load:PageServerLoad = async({params})=>{
    const routeID = params.routeID
    const categoryData = await cms.Fetch.route({ID:routeID})
    // Check if category ID exists
    if(!categoryData) throw error(404,`Categories for route:${routeID} do not exists`)
    // Else return categories list
    const categories = await cms.Fetch.categories({routeID,count:svelteCMS.config.categoriesPerPage,filter:{}})
    return { categories,routeID }
}