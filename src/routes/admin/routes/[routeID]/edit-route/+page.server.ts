import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { RouteData } from "$Types"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

// Export load function
export const load:PageServerLoad = async({params}) => {
    const routeID = params.routeID
    const routesCollection = db.collection(svelteCMS.collections.routes)
    // Check if route exists
    const routeDataDB:any = await routesCollection.findOne({ ID:routeID })
    if(!routeDataDB){
        const message = `Route:${routeID} do not exists`
        throw error(404,{ message })
    }
    delete routeDataDB['_id']
    const routeData:RouteData = routeDataDB
    return { routeData }
}