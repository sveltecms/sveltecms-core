import svelteCMS from "$svelteCMS"
import { writeFileSync } from "fs"
import { parse as parseFileInfo } from "path"
import db from "$Database"
import { type RequestHandler, json } from "@sveltejs/kit"
import type { AssetLoad,ApiResponse } from "$Packages/fileUploader/types"

export const POST:RequestHandler = async({request})=>{   
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const { ext:fileExtension,name:fileName } = parseFileInfo(file.name)
    const assetName = request.headers.get("assetName") ? request.headers.get("assetName") : fileName
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    // Save file
    const filePath = Date.now()+fileExtension
    const fileDiskPath = `${svelteCMS.diskPaths.assets}/images/${filePath}`
    let response:ApiResponse
    try{
        writeFileSync(fileDiskPath,fileBuffer)
        const assetsCollection = db.collection(svelteCMS.config.acn)
        const newAsset:AssetLoad = {
            name: assetName!,
            path: filePath,
            type: "image",
            extension: fileExtension.slice(1)
        }
        const newAssetDB = await assetsCollection.insertOne(newAsset)
        response = { ok:true,msg:"Asset created",...newAsset,_id:newAssetDB.insertedId }
    }
    catch(error:any){
        response = {
            ok:false,
            msg:error.message
        }
    }
    return json(response)
}