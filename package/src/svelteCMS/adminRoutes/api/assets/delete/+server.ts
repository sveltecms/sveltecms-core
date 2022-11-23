import db from "$Database"
import svelteCMS from "$svelteCMS"
import { ObjectId } from "mongodb"
import { json } from "@sveltejs/kit"
import fs from "fs"
import type { RequestHandler } from "./$types"
import type { AssetDeleteLoad,AssetDeleteRes } from "$Types/api"

export const POST:RequestHandler = async({request})=>{
    /** Api load data */
    const jsonData:AssetDeleteLoad = await request.json()
    const assetDbFilter = { _id: new ObjectId(jsonData._id)}
    const assetsCollection = db.collection(svelteCMS.config.acn)
    const assetExists = await assetsCollection.findOne(assetDbFilter)
    // If asset do not exists
    if(!assetExists){
        const response:AssetDeleteRes = { ok:false,msg:"Asset do not exists" }
        return json(response)
    }
    // Delete asset
    const assetDiskPath = `${svelteCMS.diskPaths.assets}/images/${jsonData.path}`
    await assetsCollection.deleteOne(assetDbFilter)
    fs.rmSync(assetDiskPath)
    const response:AssetDeleteRes = { ok:true,msg:`Asset:${jsonData.name} was deleted` }
    return json(response)
}