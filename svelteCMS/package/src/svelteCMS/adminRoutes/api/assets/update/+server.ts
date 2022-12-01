import db from "$Database"
import svelteCMS from "$svelteCMS"
import { ObjectId } from "mongodb"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { AssetUpdateLoad,AssetUpdateRes } from "$Types/api"

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
    delete assetSetData['_id']
    await assetsCollection.updateOne(assetDbFilter,{$set:assetSetData})
    const response:AssetUpdateRes = { ok:true,msg:`Asset:${jsonData.name} was updated` }
    return json(response)
}