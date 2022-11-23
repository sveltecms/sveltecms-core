import db from "$Database"
import svelteCMS from "$svelteCMS"
import type { UserData } from "$Types"
import type { AssetData } from "$Packages/fileUploader/types"
import type { PageServerLoad } from "./$types"

export const load:PageServerLoad = async ()=>{
    // Get assets count
    const assetsCollection = db.collection(svelteCMS.config.acn)
    const assetsCount = await assetsCollection.countDocuments()
    const assets:AssetData[] = await assetsCollection.find({}).map((data:any)=>{ data['_id']=data['_id'].toString() ; return data }).limit(16).toArray()
    // Get routes count
    const routesCollection = db.collection(svelteCMS.config.rcn)
    const routesCount = await routesCollection.countDocuments()
    // Get users count
    const usersCollection = db.collection(svelteCMS.config.ucn)
    const usersCount = await usersCollection.countDocuments()
    const users:UserData[] = await usersCollection.find({email:{$ne:"root@sveltecms.dev"}}).map((data:any)=>{ data['_id']=data['_id'].toString() ; return data }).limit(10).toArray()
    // result
    const stats = [
        { name:"Routes", count:routesCount, href:"/admin/routes" },
        { name:"Assets", count:assetsCount, href:"/admin/assets" },
        { name:"Users", count:usersCount, href:"/admin/users" }
    ]
    return { stats,users,assets }
}