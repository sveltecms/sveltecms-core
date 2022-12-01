import db from "$Database"
import svelteCMS from "$svelteCMS"
import { type RequestHandler, json } from "@sveltejs/kit"
import type { AssetData,SearchLoad } from "$Packages/fileUploader/types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:SearchLoad = await request.json();
    const assetsCollection = db.collection(svelteCMS.config.acn)
    const dbResult:any = await assetsCollection.find({name:{$regex:new RegExp(jsonData.assetName,"i")}}).limit(4).toArray()
    const assets:AssetData[] = dbResult
    return json(assets)
}