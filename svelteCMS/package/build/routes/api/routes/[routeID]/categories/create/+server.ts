import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { CategoryLoad, LinkedAssetData, LinkedAssetLoad, LinkedCategoryData, LinkedCategoryLoad } from "$Types"
import type { CreateCategoryLoad,CreateCategoryRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const {routeID} = params
    const jsonData:CreateCategoryLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.collections.routes}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:CreateCategoryRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if category exists
    const categoriesCollection = db.collection(`${svelteCMS.collections.baseCategories}_${routeID}`)
    const categoryDB = await categoriesCollection.findOne({ slug:jsonData.slug })
    // If category exists return error
    if(categoryDB){
        const response:CreateCategoryRes = { ok:false,msg:`Category with slug:${jsonData.slug} already exists`}
        return json(response)
    }
    // Else create new category
    const insertedCategoryDB = await categoriesCollection.insertOne(jsonData)
    // If category was inserted
    if(insertedCategoryDB){
        handleAssetLinked(`${svelteCMS.collections.baseCategories}_${routeID}`,jsonData)
        handleCategoryDeleted(jsonData)
        // Return response
        const response:CreateCategoryRes = { ok:true,msg:`Category:${jsonData.name} was created`,category:{...jsonData,_id:insertedCategoryDB.insertedId} }
        return json(response)   
    }
    // Else return bad response
    const response:CreateCategoryRes = { ok:false,msg:`Error inserting category:${jsonData.name}` }
    return json(response) 
}

/** Handle linked assets */
async function handleAssetLinked(collection:string,categoryData:CategoryLoad){
    if(categoryData.image.path==="no-image.jpeg") return
    // Run code here
    const linkedAssetsCollection = db.collection(svelteCMS.collections.linkedAssets)
    const newLinkedAsset:LinkedAssetLoad = { collection, target: "image" }
    // Check if linked exists
    const linkedExists = await linkedAssetsCollection.findOne(newLinkedAsset)
    // If do not exists, create new linked asset
    if(!linkedExists) await linkedAssetsCollection.insertOne(newLinkedAsset)
}

/** Delete category from where data is linked to */
async function handleCategoryDeleted(newCategoryData:CategoryLoad){
    const linkedCategoriesCollection = db.collection(svelteCMS.collections.linkedCategories)
    const linkedCollections = await linkedCategoriesCollection.find().toArray() 
    for(const data of linkedCollections){
        const linkedCategory:LinkedCategoryLoad = data as any
        const linkedCollection = db.collection(linkedCategory.collection)
        const filter = { [`${linkedCategory.target}.slug`]:newCategoryData.slug }
        // Remove category where category is being used
        // @ts-ignore
        linkedCollection.updateMany(filter,{ $pull: { [linkedCategory.target]:{ slug:newCategoryData.slug } } })
    }
}