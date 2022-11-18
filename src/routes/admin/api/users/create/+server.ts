import db from "$Database"
import bcrypt from "bcrypt"
import svelteCMS from "$svelteCMS"
import { json } from "@sveltejs/kit"
// @ts-ignore
import type { RequestHandler } from "./$Types"
import type { CreateUserLoad,CreateUserRes } from "$Types/api"
import type { UserLoad } from "$Types"

export const POST:RequestHandler = async({request}) => {
    const jsonData:CreateUserLoad = await request.json()
    const usersCollection = db.collection(`${svelteCMS.config.ucn}`)
    /** Check if user with this email exists */
    const userDataDB = await usersCollection.findOne({ email:jsonData.email })
    if(userDataDB){
        const response:CreateUserRes = { ok:false,msg:`User with email:${jsonData.email} already exists`}
        return json(response)
    }
    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(jsonData.password,10)
    const newUserData:UserLoad = { ...jsonData,password:hashedPassword}
    // Insert new user
    await usersCollection.insertOne(newUserData)
    const response:CreateUserRes = { ok:true,msg:`User ${jsonData.firstName} created` }
    return json(response) 
}