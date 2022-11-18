import db from "$Database"
import svelteCMS from "$svelteCMS"
import { TagsRoutes } from "$Stores"
import { getStoreData2 } from "$Utils"
import type { TagData } from "$Types"
// @ts-ignore
import type { PageServerLoad } from "./$Types"
import { error } from "@sveltejs/kit"

export const load:PageServerLoad = async({params})=>{
    const routeID = params.routeID
    const tagExists:string[] = await getStoreData2(TagsRoutes)
    // Check if tag ID exists
    if(!tagExists.includes(routeID)) throw error(404,`Tags for route:${routeID} do not exists`)
    // Else if it exists, return tags list
    const collection = db.collection(`${svelteCMS.config.tagsCollectionBase}_${routeID}`)
    // @ts-ignore
    const tagsDB:any = await collection.find({}).limit(20).map(data=>{data['_id']=data['_id'].toString();return data}).toArray()
    const tags:TagData[] = tagsDB
    return { tags,routeID }
}