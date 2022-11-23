import db from "$Database"
import svelteCMS from "$svelteCMS"
import { ASSETS } from "$Stores"
import type { AssetData } from "$Packages/fileUploader/types"
import type { PageServerLoad } from "./$types"

export const load:PageServerLoad = async()=> {
    const collection = db.collection(svelteCMS.config.assetsCollectionName)
    // @ts-ignore
    const cursor = collection.find({}).limit(svelteCMS.config.assetsPerPage).map(data=>{data['_id']=data['_id'].toString();return data})
    const assetsDB:any[] = await cursor.toArray()
    const assets:AssetData[] = assetsDB
    // Set server store
    ASSETS.set(assets)
    return { assets }    
}