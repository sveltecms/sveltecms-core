import cms from "$Cms"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { TagData } from "$Types"

export const load:PageServerLoad = async({params})=>{
    const { routeID, tagSlug } = params
    const routeData = await cms.Fetch.route({ID:routeID})
    // Check if route ID exists
    if(!routeData) throw error(404,`Route:${routeID} do not exists`)
    // Else if it exists, check if tag exists
    const tagData:any = await cms.Fetch.tag({slug:tagSlug,routeID})
    // If tag do not exists
    if(!tagData) throw error(404,`tag:${tagSlug} do not exists`)
    // Else return tag
    tagData['_id'] = tagData['_id'].toString()
    const tag:TagData = tagData
    return { tag,routeID }
}