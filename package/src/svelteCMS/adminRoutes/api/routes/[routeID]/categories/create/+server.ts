import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
// @ts-ignore
import type { RequestHandler } from "./$Types"
import type { CreateCategoryLoad,CreateCategoryRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const {routeID} = params
    const jsonData:CreateCategoryLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:CreateCategoryRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if category exists
    const categoriesCollection = db.collection(`${svelteCMS.config.ccb}_${routeID}`)
    const categoryDB = await categoriesCollection.findOne({ slug:jsonData.slug })
    // If category exists return error
    if(categoryDB){
        const response:CreateCategoryRes = { ok:false,msg:`Category with slug:${jsonData.slug} already exists`}
        return json(response)
    }
    // Else create new category
    const insertedCategoryDB = await categoriesCollection.insertOne(jsonData)
    const response:CreateCategoryRes = { ok:true,msg:`Category:${jsonData.name} was created`,category:{...jsonData,_id:insertedCategoryDB.insertedId} }
    return json(response) 
}