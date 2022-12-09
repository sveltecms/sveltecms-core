import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { UpdateTagLoad,UpdateTagRes } from "$Types/api"
import type { LinkedTagData, TagLoad } from "$Types"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:UpdateTagLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:UpdateTagRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if tag exists
    const tagsCollection = db.collection(`${svelteCMS.config.tcb}_${routeID}`)
    const tagDB = await tagsCollection.findOne({ slug:jsonData.slug })
    // If tag do not exists return error
    if(!tagDB){
        const response:UpdateTagRes = { ok:false,msg:`Tag with slug:${jsonData.slug} do not exists`}
        return json(response)
    }
    // Else update new tag
    // @ts-ignore Remove _id to avoid error 
    delete jsonData['_id']
    const updatedTagDB = await tagsCollection.updateOne({ slug:jsonData.slug },{$set:jsonData})
    // If tag was updated
    if(updatedTagDB.acknowledged){
        handleTagUpdated(jsonData)
        const response:UpdateTagRes = { ok:true,msg:`Tag:${jsonData.name} updated` }
        return json(response) 
    }
    // If tag was not updated
    const response:UpdateTagRes = { ok:false,msg:`Error updating tag:${jsonData.name}` }
    return json(response) 
}

/** Update tag where data is linked to */
async function handleTagUpdated(newTagData:TagLoad){
    const linkedTagsCollection = db.collection(svelteCMS.collections.linkedTags)
    const linkedCollections = await linkedTagsCollection.find().toArray() 
    for(const data of linkedCollections){
        const linkedTag:LinkedTagData = data as any
        const linkedCollection = db.collection(linkedTag.collection)
        const filter = { [`${linkedTag.target}.slug`]:newTagData.slug }
        // Update Tag where Tag is being used
        linkedCollection.updateMany(filter,{$set:{[`${linkedTag.target}.$`]:newTagData}})
    }
}