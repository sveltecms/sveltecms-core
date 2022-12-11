import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { DeleteCategoryLoad,DeleteCategoryRes } from "$Types/api"
import type { CategoryLoad, LinkedCategoryData } from "$Types"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:DeleteCategoryLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.collections.routes}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:DeleteCategoryRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if category exists
    const categoriesCollection = db.collection(`${svelteCMS.collections.baseCategories}_${routeID}`)
    const categoryDB = await categoriesCollection.findOne({ slug:jsonData.slug })
    // If category do not exists return error
    if(!categoryDB){
        const response:DeleteCategoryRes = { ok:false,msg:`Category with slug:${jsonData.slug} do not exists`}
        return json(response)
    }
    // Delete category
    // @ts-ignore Remove _id to avoid error 
    delete jsonData['_id']
    const categoryDeleted = await categoriesCollection.deleteOne({ slug:jsonData.slug })
    // if category was deleted
    if(categoryDeleted.acknowledged){
        handleCategoryDeleted(jsonData)
        const response:DeleteCategoryRes = { ok:true,msg:`Category:${jsonData.name} was deleted` }
        return json(response) 
    }
    // if category was not deleted
    const response:DeleteCategoryRes = { ok:false,msg:`Error deleting category:${jsonData.name}` }
    return json(response) 
}

/** Delete category from where data is linked to */
async function handleCategoryDeleted(newCategoryData:CategoryLoad){
    const linkedCategoriesCollection = db.collection(svelteCMS.collections.linkedCategories)
    const linkedCollections = await linkedCategoriesCollection.find().toArray() 
    for(const data of linkedCollections){
        const linkedCategory:LinkedCategoryData = data as any
        const linkedCollection = db.collection(linkedCategory.collection)
        const filter = { [`${linkedCategory.target}.slug`]:newCategoryData.slug }
        // Remove Category where Category is being used
        // @ts-ignore
        linkedCollection.updateMany(filter,{ $pull: { [linkedCategory.target]:{ slug:newCategoryData.slug } } })
    }
}