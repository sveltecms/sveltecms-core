import db from "$Database"
import svelteCMS from "$svelteCMS"
import { ObjectId } from "mongodb"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { AssetUpdateLoad,AssetUpdateRes } from "$Types/api"
import type { AssetData } from "$Packages/fileUploader/types"
import type { LinkedAssetData } from "$Types"

export const POST:RequestHandler = async({request})=>{
    /** Api load data */
    const jsonData:AssetUpdateLoad = await request.json()
    const assetDbFilter = { _id: new ObjectId(jsonData._id)}
    const assetsCollection = db.collection(svelteCMS.config.acn)
    const assetExists = await assetsCollection.findOne(assetDbFilter)
    // If asset do not exists
    if(!assetExists){
        const response:AssetUpdateRes = { ok:false,msg:"Asset do not exists" }
        return json(response)
    }
    // Update asset
    const assetSetData = jsonData
    const originalAssetSetData = { ...jsonData }
    delete assetSetData['_id']
    const assetUpdatedDB = await assetsCollection.updateOne(assetDbFilter,{$set:assetSetData})
    // If asset was updated
    if(assetUpdatedDB.acknowledged){
        handleAssetUpdated(originalAssetSetData)
        // Return response
        const response:AssetUpdateRes = { ok:true,msg:`Asset:${jsonData.name} was updated` }
        return json(response)
    }
    // Else if not updated
    const response:AssetUpdateRes = { ok:false,msg:`Error updating asset:${jsonData.name}` }
    return json(response)
}

/** Update asset where data is linked to */
async function handleAssetUpdated(newAssetData:AssetData){
    const linkedAssetsCollection = db.collection(svelteCMS.collections.linkedAssets)
    const linkedCollections = await linkedAssetsCollection.find().toArray() 
    for(const data of linkedCollections){
        const linkedAsset:LinkedAssetData = data as any
        const linkedCollection = db.collection(linkedAsset.collection)
        const filter = { [`${linkedAsset.target}._id`]:newAssetData._id }
        // Update asset where asset is being used
        linkedCollection.updateMany(filter,{$set:{[`${linkedAsset.target}`]:newAssetData}})
    }
}