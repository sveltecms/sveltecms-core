import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { UserData } from "$Types"
import type { PageServerLoad } from "./$types"

export const load:PageServerLoad = async()=>{
    const usersCollection = db.collection(svelteCMS.config.ucn)
    const usersDB = await usersCollection.find({email:{$ne:"root@sveltecms.dev"}}).map((data:any)=>{data['_id']=data['_id'].toString(); return data }).toArray()
    const users:UserData[] = usersDB
    return { users }
}