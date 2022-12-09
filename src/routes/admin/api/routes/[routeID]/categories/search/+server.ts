import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { SearchCategoryLoad,SearchCategoryRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const {routeID} = params
    const jsonData:SearchCategoryLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:SearchCategoryRes = []
        return json(response)
    }
    // Search categories
    const categoriesCollection = db.collection(`${svelteCMS.config.ccb}_${routeID}`)
    const categoriesDB:any = await categoriesCollection.findOne({ name:{$regex:new RegExp(jsonData.query,"i")} })
    const response:SearchCategoryRes = categoriesDB ? [categoriesDB] : []
    return json(response) 
}