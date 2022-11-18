import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { UpdateRouteLoad,UpdateRouteRes } from "$Types/api"
import { type RequestHandler, json } from "@sveltejs/kit"

export const POST:RequestHandler = async({params,request})=>{   
    const {routeID} = params
    const jsonData:UpdateRouteLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:UpdateRouteRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Update route
    delete jsonData['_id']
    const response:UpdateRouteRes = { ok:true,msg:`Route:${jsonData.ID} was updated` }
    const routeUpdatedDB = await routesCollection.updateOne({ ID:routeID },{$set:{...jsonData}})
    return json(response)
}