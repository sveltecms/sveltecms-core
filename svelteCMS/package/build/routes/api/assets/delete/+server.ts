import db from "$Database"
import svelteCMS from "$svelteCMS"
import { ObjectId } from "mongodb"
import { json } from "@sveltejs/kit"
import fs from "fs"
import type { RequestHandler } from "./$types"
import type { AssetDeleteLoad,AssetDeleteRes } from "$Types/api"
import type { AssetData } from "$Packages/fileUploader/types"
import type { LinkedAssetData } from "$Types"

export const POST:RequestHandler = async({request})=>{
    /** Api load data */
    const jsonData:AssetDeleteLoad = await request.json()
    const assetDbFilter = { _id: new ObjectId(jsonData._id)}
    const assetsCollection = db.collection(svelteCMS.collections.assets)
    const assetExists = await assetsCollection.findOne(assetDbFilter)
    // If asset do not exists
    if(!assetExists){
        const response:AssetDeleteRes = { ok:false,msg:"Asset do not exists" }
        return json(response)
    }
    // Delete asset
    const assetDiskPath = `${svelteCMS.diskPaths.assets}/images/${jsonData.path}`
    const assetDeleted = await assetsCollection.deleteOne(assetDbFilter)
    // If asset was deleted
    if(assetDeleted){
        handleAssetDeleted(jsonData)
        fs.rmSync(assetDiskPath)
        const response:AssetDeleteRes = { ok:true,msg:`Asset:${jsonData.name} was deleted` }
        return json(response)
    }
    // If error deleting asset
    const response:AssetDeleteRes = { ok:false,msg:`Error deleting asset:${jsonData.name}` }
    return json(response)
}

/** Delete asset from objects, where asset is being used */
async function handleAssetDeleted(assetData:AssetData){
    const linkedAssetsCollection = db.collection(svelteCMS.collections.linkedAssets)
    const linkedCollections = await linkedAssetsCollection.find().toArray() 
    for(const data of linkedCollections){
        const linkedAsset:LinkedAssetData = data as any
        const linkedCollection = db.collection(linkedAsset.collection)
        const filter = { [`${linkedAsset.target}._id`]:assetData._id }
        // Replace with default asset
        linkedCollection.updateMany(filter,{ $set:{[`${linkedAsset.target}`]:svelteCMS.defaults.asset} })
    }
}