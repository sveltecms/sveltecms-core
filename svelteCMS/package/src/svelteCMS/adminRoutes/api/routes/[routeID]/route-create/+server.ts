import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { CreateRouteLoad,CreateRouteRes } from "$Types/api"
import { type RequestHandler, json } from "@sveltejs/kit"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:CreateRouteLoad = await request.json();
    const routesCollection = db.collection(svelteCMS.config.routesCollectionName)
    /** Check if route ID exists, if yes return error */
    const routeDataDB = await routesCollection.findOne({ID:jsonData.ID})
    if(routeDataDB){
        const response:CreateRouteRes = { ok:false,msg:`Route:${jsonData.ID} already exists` }
        return json(response)
    }
    // Else add new routes
    const insertRouteDB = await routesCollection.insertOne(jsonData)
    // If route was created
    if(insertRouteDB.acknowledged){
        const response:CreateRouteRes = { ok:true,msg:`Route:${jsonData.ID} was created` }
        return json(response)
    }
    // If route was not created
    else{
        const response:CreateRouteRes = { ok:false,msg:`Something went wrong creating route:${jsonData.ID}` }
        return json(response)
    }
} 