import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { DeleteRouteLoad,DeleteRouteRes } from "$Types/api"
import type { RouteData } from "$Types"

export const POST:RequestHandler = async({params,request}) => {
    const {routeID} = params
    const jsonData:DeleteRouteLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.collections.routes}`)
    /** List of collection from database */
    const routeCollectionsArray =  await db.listCollections().toArray()
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    // If route do not exists, return error
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
    if(routeCollectionsArray.find(data=>data.name===`${svelteCMS.collections.baseCategories}_${routeID}`)){
        db.collection(`${svelteCMS.collections.baseCategories}_${routeID}`).drop()
    }
    // Drop this route tags collection
    if(routeCollectionsArray.find(data=>data.name===`${svelteCMS.collections.baseTags}_${routeID}`)){
        db.collection(`${svelteCMS.collections.baseTags}_${routeID}`).drop()
    }
    // Handle route deleted
    handleRouteDeleted(jsonData)
    // Return response
    const response:DeleteRouteRes = { ok:true,msg:`Route:${routeID} was delete` }
    return json(response) 
}

/** Delete any linked assets,tags and categories to this route */
async function handleRouteDeleted(route:RouteData){
    // Drop all linked assets to this route
    const linkedAssetsCollection = db.collection(svelteCMS.collections.linkedAssets)
    linkedAssetsCollection.deleteMany({ collection:route.ID })
    // Drop all linked tags to this route
    if(route.includeTags==="yes"){
        const linkedTagsCollection = db.collection(svelteCMS.collections.linkedTags)
        linkedTagsCollection.deleteMany({ collection:route.ID })
    }
    // Drop all linked categories to this route
    if(route.includeTags==="yes"){
        const linkedCategoriesCollection = db.collection(svelteCMS.collections.linkedCategories)
        linkedCategoriesCollection.deleteMany({ collection:route.ID })
    }
}