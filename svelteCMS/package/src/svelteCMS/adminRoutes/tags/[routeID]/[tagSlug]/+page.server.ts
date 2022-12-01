import db from "$Database"
import svelteCMS from "$svelteCMS"
import { error } from "@sveltejs/kit"
// @ts-ignore
import type { PageServerLoad } from "./$Types"
import type { TagData } from "$Types"

export const load:PageServerLoad = async({params})=>{
    const { routeID, tagSlug } = params
    const collectionName = svelteCMS.config.rcn
    const routesCollection = db.collection(collectionName)
    const routeDataDB = await routesCollection.findOne({ID:routeID})
    // Check if route ID exists
    if(!routeDataDB) throw error(404,`Route:${routeID} do not exists`)
    // Else if it exists, check if tag exists
    const tagsCollectionName = `${svelteCMS.config.tcb}_${routeID}`
    const tagsCollection = db.collection(tagsCollectionName)
    const tagDB:any = await tagsCollection.findOne({slug:tagSlug})
    // If tag do not exists
    if(!tagDB) throw error(404,`Tag:${tagDB} do not exists`)
    // Else return tag
    tagDB['_id'] = tagDB['_id'].toString()
    const tag:TagData = tagDB
    return { tag,routeID }
}