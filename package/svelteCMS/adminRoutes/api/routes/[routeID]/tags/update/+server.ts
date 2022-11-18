import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
// @ts-ignore
import type { RequestHandler } from "./$Types"
import type { UpdateTagLoad,UpdateTagRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:UpdateTagLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:UpdateTagRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if tag exists
    const tagsCollection = db.collection(`${svelteCMS.config.tcb}_${routeID}`)
    const tagDB = await tagsCollection.findOne({ slug:jsonData.slug })
    // If tag do not exists return error
    if(!tagDB){
        const response:UpdateTagRes = { ok:false,msg:`Tag with slug:${jsonData.slug} do not exists`}
        return json(response)
    }
    // Else update new tag
    // TODO: update from objects that includes this tag
    // @ts-ignore Remove _id to avoid error 
    delete jsonData['_id']
    const updatedTagDB = await tagsCollection.updateOne({ slug:jsonData.slug },{$set:jsonData})
    const response:UpdateTagRes = { ok:true,msg:`Tag:${jsonData.name} updated` }
    return json(response) 
}