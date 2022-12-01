import cms from "$Cms"
import svelteCMS from "$svelteCMS"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

export const load:PageServerLoad = async({params})=>{
    const routeID = params.routeID
    const tagData = await cms.Fetch.route({ID:routeID})
    // Check if tag ID exists
    if(!tagData) throw error(404,`Tags for route:${routeID} do not exists`)
    // Else return tags list
    const tags = await cms.Fetch.tags({routeID,count:svelteCMS.config.tagsPerPage,filter:{}})
    return { tags,routeID }
}