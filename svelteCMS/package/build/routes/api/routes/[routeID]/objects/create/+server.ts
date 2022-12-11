import db from "$Database"
import { elementsToObject } from "$Utils"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { CreateRouteObjectLoad,CreateRouteObjectRes } from "$Types/api"
import type { ElementData, LinkedAssetLoad } from "$Types"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:CreateRouteObjectLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.collections.routes}`)
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
        // Create link to assets if any element contain asset as value
        handleAssetLinked(routeID,jsonData.elements)
        // Return response
        const response:CreateRouteObjectRes = { ok:true,msg:`Route object:${insertedObjectDB.insertedId} was created`}
        return json(response)
    }
    // If object was not inserted to collection
    const response:CreateRouteObjectRes = { ok:false,msg:`Something went wrong inserting new object`}
    return json(response)
}


/** Update asset where data is linked to */
async function handleAssetLinked(collection:string,elements:ElementData[]){
    const linkedAssetsCollection = db.collection(svelteCMS.collections.linkedAssets)
    const elementsWithAsset = elements.filter(data=>data.type==="image")
    for(const element of elementsWithAsset){
        const newLinkedAsset:LinkedAssetLoad = { collection, target: element.ID }
        // Check if linked exists
        const linkedExists = await linkedAssetsCollection.findOne(newLinkedAsset)
        // If do not exists, create new linked asset
        if(!linkedExists) await linkedAssetsCollection.insertOne(newLinkedAsset)
    }
}