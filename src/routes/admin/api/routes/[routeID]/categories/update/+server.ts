import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
// @ts-ignore
import type { RequestHandler } from "./$Types"
import type { UpdateCategoryLoad,UpdateCategoryRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:UpdateCategoryLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:UpdateCategoryRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if category exists
    const categoriesCollection = db.collection(`${svelteCMS.config.ccb}_${routeID}`)
    const categoryDB = await categoriesCollection.findOne({ slug:jsonData.slug })
    // If category do not exists return error
    if(!categoryDB){
        const response:UpdateCategoryRes = { ok:false,msg:`Category with slug:${jsonData.slug} already exists`}
        return json(response)
    }
    // Else update category
    // TODO: update from objects that includes this category
    // @ts-ignore Remove _id to avoid error 
    delete jsonData['_id']
    const updatedCategoryDB = await categoriesCollection.updateOne({ slug:jsonData.slug },{$set:jsonData})
    const response:UpdateCategoryRes = { ok:true,msg:`Category:${jsonData.name} was updated` }
    return json(response) 
}