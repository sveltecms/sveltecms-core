import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { LinkedCategoryLoad, LinkedTagLoad, RouteLoad } from "$Types"
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
    const routeUpdatedDB = await routesCollection.updateOne({ ID:routeID },{$set:{...jsonData}})
    // If route was updated
    if(routeUpdatedDB){
        handleCategoryTagLinked(jsonData.ID,jsonData)
        const response:UpdateRouteRes = { ok:true,msg:`Route:${jsonData.ID} was updated` }
        return json(response)
    }
    // If error updating
    const response:UpdateRouteRes = { ok:false,msg:`Error updating route:${jsonData.ID}` }
    return json(response)
}

/** Handle categories and tags link (link category) */
async function handleCategoryTagLinked(collection:string,route:RouteLoad){
    if(route.includeCategories==="yes"){
        const linkedCategoriesCollection = db.collection(svelteCMS.collections.linkedCategories)
        const newLinkedAsset:LinkedCategoryLoad = { collection, target: "categories" }
        // Check if linked exists
        const linkedExists = await linkedCategoriesCollection.findOne(newLinkedAsset)
        // If do not exists, create new linked asset
        if(!linkedExists) await linkedCategoriesCollection.insertOne(newLinkedAsset)
    }
    if(route.includeTags==="yes"){
        const linkedTagsCollection = db.collection(svelteCMS.collections.linkedTags)
        const newLinkedAsset:LinkedTagLoad = { collection, target: "tags" }
        // Check if linked exists
        const linkedExists = await linkedTagsCollection.findOne(newLinkedAsset)
        // If do not exists, create new linked asset
        if(!linkedExists) await linkedTagsCollection.insertOne(newLinkedAsset)
    }
}