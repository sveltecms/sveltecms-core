import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
// @ts-ignore
import type { RequestHandler } from "./$types"
import type { DeleteCategoryLoad,DeleteCategoryRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:DeleteCategoryLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:DeleteCategoryRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if category exists
    const categoriesCollection = db.collection(`${svelteCMS.config.ccb}_${routeID}`)
    const categoryDB = await categoriesCollection.findOne({ slug:jsonData.slug })
    // If category do not exists return error
    if(!categoryDB){
        const response:DeleteCategoryRes = { ok:false,msg:`Category with slug:${jsonData.slug} do not exists`}
        return json(response)
    }
    // Delete category
    // TODO: update from objects that includes this category
    // @ts-ignore Remove _id to avoid error 
    delete jsonData['_id']
    const deletedCategoryDB = await categoriesCollection.deleteOne({ slug:jsonData.slug })
    const response:DeleteCategoryRes = { ok:true,msg:`Category:${jsonData.name} was deleted` }
    return json(response) 
}