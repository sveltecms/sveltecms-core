import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { CreateTagLoad,CreateTagRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const {routeID} = params
    const jsonData:CreateTagLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.collections.routes}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:CreateTagRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if tag exists
    const tagsCollection = db.collection(`${svelteCMS.collections.baseTags}_${routeID}`)
    const tagDB = await tagsCollection.findOne({ slug:jsonData.slug })
    // If tag exists return error
    if(tagDB){
        const response:CreateTagRes = { ok:false,msg:`Tag with slug:${jsonData.slug} already exists`}
        return json(response)
    }
    // Else create new tag
    const insertedTagDB = await tagsCollection.insertOne(jsonData)
    const response:CreateTagRes = { ok:true,msg:`Tag:${jsonData.name} created`,tag:{...jsonData,_id:insertedTagDB.insertedId} }
    return json(response) 
}