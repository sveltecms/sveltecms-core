import db from "$Database"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
// @ts-ignore
import type { RequestHandler } from "./$Types"
import type { DeleteUserLoad,DeleteUserRes } from "$Types/api"

export const POST:RequestHandler = async({request}) => {
    const jsonData:DeleteUserLoad = await request.json()
    const usersCollection = db.collection(`${svelteCMS.config.ucn}`)
    /** Check if user exists */
    const userDataDB = await usersCollection.findOne({ email:jsonData.email })
    // If user do not exists, return error
    if(!userDataDB){
        const response:DeleteUserRes = { ok:false,msg:`User with ${jsonData.email} do not exists`}
        return json(response)
    }
    // Check if user is not the default root user
    const isDefaultUser = jsonData.email==="root@sveltecms.dev" && jsonData.firstName==="svelte" && jsonData.lastName==="cms"
    if(isDefaultUser){
        const response:DeleteUserRes = { ok:false,msg:"Root user can never be deleted" }
        return json(response)
    }
    // Delete user
    await usersCollection.deleteOne({ email:jsonData.email })
    const response:DeleteUserRes = { ok:true,msg:`User ${jsonData.firstName} was deleted` }
    return json(response) 
}