import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
// @ts-ignore
import type { RequestHandler } from "./$Types"
import type { DeleteRouteLoad,DeleteRouteRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const {routeID} = params
    const jsonData:DeleteRouteLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** List of collection from database */
    const routeCollectionsArray =  await db.listCollections().toArray()
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:DeleteRouteRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Always check if collection exists(mongoDB only create collection if objects were inserted)
    // Delete route from routes collection
    await routesCollection.deleteOne({ID:jsonData.ID})
    // Drop this route collection
    if(routeCollectionsArray.find(data=>data.name===routeID)){
        db.collection(routeID).drop()
    }
    // Drop this route categories collection
    if(routeCollectionsArray.find(data=>data.name===`${svelteCMS.config.ccb}_${routeID}`)){
        db.collection(`${svelteCMS.config.ccb}_${routeID}`).drop()
    }
    // Drop this route tags collection
    if(routeCollectionsArray.find(data=>data.name===`${svelteCMS.config.tcb}_${routeID}`)){
        db.collection(`${svelteCMS.config.tcb}_${routeID}`).drop()
    }
    // Return response
    const response:DeleteRouteRes = { ok:true,msg:`Route:${routeID} was delete` }
    return json(response) 
}