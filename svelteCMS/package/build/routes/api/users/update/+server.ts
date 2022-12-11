import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import type { UpdateUserLoad,UpdateUserRes } from "$Types/api"

export const POST:RequestHandler = async({request}) => {
    const jsonData:UpdateUserLoad = await request.json()
    const usersCollection = db.collection(`${svelteCMS.collections.users}`)
    /** Check if user exists */
    const userDataDB = await usersCollection.findOne({ email:jsonData.email })
    // If user do not exists, return error
    if(!userDataDB){
        const response:UpdateUserRes = { ok:false,msg:`User with ${jsonData.email} do not exists`}
        return json(response)
    }
    // Update user
    const newUserData = jsonData
    delete newUserData['_id']
    await usersCollection.updateOne({ email:jsonData.email },{$set:{...newUserData}})
    const response:UpdateUserRes = { ok:true,msg:`User ${jsonData.firstName} was updated` }
    return json(response) 
}