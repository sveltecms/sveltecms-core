import db from "$Database"
import { ROUTES } from "$Stores"
import { getStoreData } from "$Utils"
import type { RouteValueData } from "$Types"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

// Export load function
export const load:PageServerLoad = async({params}) => {
    const routeID = params.routeID
    const routeData:RouteValueData = await getStoreData(ROUTES,routeID)
    // Check if route id exists
    if(!routeData) throw error(404,{message:"Route do not exists"})
    // Else route object and return data
    const collection = db.collection(routeID)
    // @ts-ignore
    const objectsDB:any = await collection.find({}).limit(20).map(data=>{ data['_id']=data['_id'].toString() ; return data }).toArray()
    const objects:{[key:string]:any}[] = objectsDB
    return { routeData,objects }
}