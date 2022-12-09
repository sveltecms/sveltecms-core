import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { LinkedCategoryLoad, LinkedTagLoad, RouteLoad } from "$Types"
import type { CreateRouteLoad,CreateRouteRes } from "$Types/api"
import { type RequestHandler, json } from "@sveltejs/kit"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:CreateRouteLoad = await request.json();
    const routesCollection = db.collection(svelteCMS.collections.routes)
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
        handleCategoryTagLinked(jsonData.ID,jsonData)
        const response:CreateRouteRes = { ok:true,msg:`Route:${jsonData.ID} was created` }
        return json(response)
    }
    // If route was not created 
    else{
        const response:CreateRouteRes = { ok:false,msg:`Something went wrong creating route:${jsonData.ID}` }
        return json(response)
    }
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