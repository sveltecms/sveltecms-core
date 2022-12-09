import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { DeleteRouteObjectLoad,DeleteRouteObjectRes } from "$Types/api"
import { ObjectId } from "mongodb"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:any = await request.json()
    const routesCollection = db.collection(`${svelteCMS.collections.routes}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:DeleteRouteObjectLoad = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if object exists
    const objectsCollection = db.collection(routeID)
    const objectDB = await objectsCollection.findOne({ _id:new ObjectId(jsonData._id) })
    // If object do not exists return error
    if(!objectDB){
        const response:DeleteRouteObjectRes = { ok:false,msg:`Object with id:${jsonData._id} do not exists`}
        return json(response)
    }
    // Delete object
    // @ts-ignore Remove _id to avoid error 
    const deletedCategoryDB = await objectsCollection.deleteOne({ _id:new ObjectId(jsonData._id) })
    const response:DeleteRouteObjectRes = { ok:true,msg:`Object:${jsonData._id} was deleted` }
    return json(response) 
}