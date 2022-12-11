import cms from "$Cms"
import { json } from "@sveltejs/kit"
import type { FetchRouteObjectsLoad } from "$Types/cms"
import type { RequestHandler } from "./$types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:FetchRouteObjectsLoad = await request.json()
    const objects = await cms.Fetch.routeObjects(jsonData)
    return json(objects)
}