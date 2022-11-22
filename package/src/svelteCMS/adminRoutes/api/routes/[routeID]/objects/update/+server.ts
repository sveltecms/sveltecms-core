import db from "$Database"
import { elementsToObject } from "$Utils"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { UpdateRouteObjectLoad,UpdateRouteObjectRes } from "$Types/api"
import { ObjectId } from "mongodb"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:UpdateRouteObjectLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:UpdateRouteObjectRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Create collection cursor
    const objectsCollection = db.collection(routeID)
    // Check if object really exists in database
    const objectDataDB = await objectsCollection.findOne({ _id:new ObjectId(jsonData.objectID)})
    // If object not in database, return error
    if(!objectDataDB){
        const response:UpdateRouteObjectRes = { ok:false,msg:`Object with id:${jsonData.objectID} do not exists`}
        return json(response)
    }
    // Update object
    /** Convert elements to json object */
    const updatedObjectData = elementsToObject(jsonData.elements)
    const updatedObjectDB = await objectsCollection.updateOne({ _id:new ObjectId(jsonData.objectID)},{$set:updatedObjectData})
    // If object was updated to collection
    if(updatedObjectDB.acknowledged){
        const response:UpdateRouteObjectRes = { ok:true,msg:`Route object:${jsonData.objectID} was updated`}
        return json(response)
    }
    // If object was not inserted to collection
    const response:UpdateRouteObjectRes = { ok:false,msg:`Something went wrong updating object:${jsonData.objectID}`}
    return json(response)
}