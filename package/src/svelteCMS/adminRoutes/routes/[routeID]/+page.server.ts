import cms from "$Cms"
import svelteCMS from "$svelteCMS"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load:PageServerLoad = async({params})=>{
    const routeID = params.routeID
    const routeDataDB = await cms.Fetch.route({ ID:routeID })
    // Check if route id exists
    if(!routeDataDB) throw error(404,{message:`Route:${routeID} do not exists`})
    // Else get route objects
    const routeObjects = await cms.Fetch.routeObjects({ filter:{},routeID,count:svelteCMS.config.routeObjectsPerPage })
    // Convert MongoDB ObjectId to string to avoid non-POJOs error from svelte kit
    routeDataDB['_id'] = routeDataDB['_id'].toString()
    return { routeObjects,routeData:routeDataDB,routeID }
}