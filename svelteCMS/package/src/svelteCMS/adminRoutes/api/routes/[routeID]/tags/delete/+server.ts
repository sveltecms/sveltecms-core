import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { DeleteTagLoad,DeleteTagRes } from "$Types/api"
import type { LinkedTagData, TagLoad } from "$Types"

export const POST:RequestHandler = async({params,request}) => {
    const { routeID } = params
    const jsonData:DeleteTagLoad = await request.json()
    const routesCollection = db.collection(`${svelteCMS.config.rcn}`)
    /** Check route id exists */
    const routeIDExists = await routesCollection.findOne({ ID:routeID })
    if(!routeIDExists){
        const response:DeleteTagRes = { ok:false,msg:`Route:${routeID} do not exists`}
        return json(response)
    }
    // Check if tag exists
    const tagsCollection = db.collection(`${svelteCMS.config.tcb}_${routeID}`)
    const tagDB = await tagsCollection.findOne({ slug:jsonData.slug })
    // If tag do not exists return error
    if(!tagDB){
        const response:DeleteTagRes = { ok:false,msg:`Tag with slug:${jsonData.slug} do not exists`}
        return json(response)
    }
    // Delete tag
    // @ts-ignore Remove _id to avoid error 
    delete jsonData['_id']
    const tagDeleted = await tagsCollection.deleteOne({ slug:jsonData.slug })
    // If tag was deleted
    if(tagDeleted.acknowledged){
        handleTagDeleted(jsonData)
        const response:DeleteTagRes = { ok:true,msg:`Tag:${jsonData.name} was deleted` }
        return json(response) 
    }
    // If tag was not deleted
    const response:DeleteTagRes = { ok:false,msg:`Error deleting tag:${jsonData.name}` }
    return json(response) 
}

/** Delete tag from where data is linked to */
async function handleTagDeleted(newTagData:TagLoad){
    const linkedTagsCollection = db.collection(svelteCMS.collections.linkedTags)
    const linkedCollections = await linkedTagsCollection.find().toArray() 
    for(const data of linkedCollections){
        const linkedTag:LinkedTagData = data as any
        const linkedCollection = db.collection(linkedTag.collection)
        const filter = { [`${linkedTag.target}.slug`]:newTagData.slug }
        // Remove Tag where Tag is being used
        // @ts-ignore
        linkedCollection.updateMany(filter,{ $pull: { [linkedTag.target]:{ slug:newTagData.slug } } })
    }
}