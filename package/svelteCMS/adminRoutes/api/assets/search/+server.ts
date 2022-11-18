import db from "$Database"
import config from "../config"
import { type RequestHandler, json } from "@sveltejs/kit"
import type { AssetData,SearchLoad } from "$Packages/fileUploader/types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:SearchLoad = await request.json();
    const assetCollection = db.collection(config.collectionName)
    const dbResult:any = await assetCollection.find({name:{$regex:new RegExp(jsonData.assetName,"i")}}).limit(4).toArray()
    const assets:AssetData[] = dbResult
    return json(assets)
}