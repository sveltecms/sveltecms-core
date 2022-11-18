import db from "$Database"
import { type RequestHandler, json } from "@sveltejs/kit"
import type { AssetData } from "$Packages/fileUploader/types"

export const POST:RequestHandler = async({request})=>{   
    const assetCollection = await db("assets")
    const dbResult:any = await assetCollection.find({}).limit(20).toArray()
    const assets:AssetData[] = dbResult
    return json(assets)
}