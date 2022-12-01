import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { RouteData, RouteObjectData } from "$Types"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

// Export load function
export const load:PageServerLoad = async({params}) => {
    const { routeID,objectID } = params
    const routesCollection = db.collection(svelteCMS.config.rcn)
    // Check if route exists
    const routeDataDB:any = await routesCollection.findOne({ ID:routeID })
    if(!routeDataDB){
        const message = `Route:${routeID} do not exists`
        throw error(404,{ message })
    }
    // Return check object id exists
    const routeObjectsCollection = db.collection(routeID)
    const objectDataDB = await routeObjectsCollection.findOne({ _id:new ObjectId(objectID) })
    // If object data was not founded
    if(!objectDataDB){
        const message = `Route object:${objectID} do not exists`
        throw error(404,{ message })
    }
    // Return object data
    // @ts-ignore
    objectDataDB['_id'] = objectDataDB['_id'].toString()
    // @ts-ignore
    routeDataDB['_id'] = routeDataDB['_id'].toString()
    const routeData:RouteData = routeDataDB
    const objectData:RouteObjectData = objectDataDB
    return { routeData,objectData }
}