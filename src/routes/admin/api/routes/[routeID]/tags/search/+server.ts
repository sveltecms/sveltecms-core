import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { SearchTagLoad,SearchTagRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const {routeID} = params
    const jsonData:SearchTagLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:SearchTagRes = []
        return json(response)
    }
    // Search tags
    const tagsCollection = db.collection(`${svelteCMS.config.tcb}_${routeID}`)
    const tagsDB:any = await tagsCollection.findOne({ name:{$regex:new RegExp(jsonData.query,"i")} })
    const response:SearchTagRes = tagsDB ? [tagsDB] : []
    return json(response) 
}