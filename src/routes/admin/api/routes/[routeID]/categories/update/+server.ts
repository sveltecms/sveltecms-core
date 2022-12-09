import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { CategoryData, CategoryLoad, LinkedAssetData, LinkedAssetLoad, LinkedCategoryData } from "$Types"
import type { RequestHandler } from "./$types"
import type { UpdateCategoryLoad,UpdateCategoryRes } from "$Types/api"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:UpdateCategoryLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.collections.routes}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:UpdateCategoryRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if category exists
    const categoriesCollection = db.collection(`${svelteCMS.collections.baseCategories}_${routeID}`)
    const categoryDB = await categoriesCollection.findOne({ slug:jsonData.slug })
    // If category do not exists return error
    if(!categoryDB){
        const response:UpdateCategoryRes = { ok:false,msg:`Category with slug:${jsonData.slug} already exists`}
        return json(response)
    }
    // Else update category
    // @ts-ignore Remove _id to avoid error 
    delete jsonData['_id']
    const categoryUpdated = await categoriesCollection.updateOne({ slug:jsonData.slug },{$set:jsonData})
    if(categoryUpdated.acknowledged){
        handleAssetLinked(`${svelteCMS.collections.baseCategories}_${routeID}`,jsonData)
        handleCategoryUpdated(jsonData)
        // Return response
        const response:UpdateCategoryRes = { ok:true,msg:`Category:${jsonData.name} was updated` }
        return json(response) 
    }
    // Else return bad response
    const response:UpdateCategoryRes = { ok:true,msg:`Category:${jsonData.name} was updated` }
    return json(response) 
}

/** Handle linked assets */
async function handleAssetLinked(collection:string,categoryData:CategoryData|CategoryLoad){
    if(categoryData.image.path==="no-image.jpeg") return
    // Run code here
    const linkedAssetsCollection = db.collection(svelteCMS.collections.linkedAssets)
    const newLinkedAsset:LinkedAssetLoad = { collection, target: "image" }
    // Check if linked exists
    const linkedExists = await linkedAssetsCollection.findOne(newLinkedAsset)
    // If do not exists, create new linked asset
    if(!linkedExists) await linkedAssetsCollection.insertOne(newLinkedAsset)
}

/** Update category where data is linked to */
async function handleCategoryUpdated(newCategoryData:CategoryLoad){
    const linkedCategoriesCollection = db.collection(svelteCMS.collections.linkedCategories)
    const linkedCollections = await linkedCategoriesCollection.find().toArray() 
    for(const data of linkedCollections){
        const linkedCategory:LinkedCategoryData = data as any
        const linkedCollection = db.collection(linkedCategory.collection)
        const filter = { [`${linkedCategory.target}.slug`]:newCategoryData.slug }
        // Update Category where Category is being used
        linkedCollection.updateMany(filter,{$set:{[`${linkedCategory.target}.$`]:newCategoryData}})
    }
}