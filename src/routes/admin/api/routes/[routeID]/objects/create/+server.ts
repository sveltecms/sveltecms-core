import db from "$Database"
import { elementsToObject } from "$Utils"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { CreateRouteObjectLoad,CreateRouteObjectRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:CreateRouteObjectLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:CreateRouteObjectRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Create collection cursor
    const routeObjectsCollection = db.collection(routeID)
    /** Check for slug duplicates */
    const findElementSlug = jsonData.elements.find(data=>data.type==="slug")
    if(findElementSlug){
        const slugDataDB = await routeObjectsCollection.findOne({ slug:findElementSlug.value })
        if(slugDataDB){
            const response:CreateRouteObjectRes = { ok:false,msg:`Route object with slug:${findElementSlug.value} already exists`}
            return json(response)
        }
    }
    // Create route object
    /** Convert elements to json object */
    const newObjectData = elementsToObject(jsonData.elements)
    const insertedObjectDB = await routeObjectsCollection.insertOne(newObjectData)
    // If object was inserted to collection
    if(insertedObjectDB.acknowledged){
        const response:CreateRouteObjectRes = { ok:true,msg:`Route object:${insertedObjectDB.insertedId} was created`}
        return json(response)
    }
    // If object was not inserted to collection
    const response:CreateRouteObjectRes = { ok:false,msg:`Something went wrong inserting new object`}
    return json(response)
}