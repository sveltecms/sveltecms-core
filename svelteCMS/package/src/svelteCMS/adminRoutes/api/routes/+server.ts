import cms from "$Cms"
import { json } from "@sveltejs/kit"
import type { FetchRoutesLoad } from "$Types/cms"
import type { RequestHandler } from "./$types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:FetchRoutesLoad = await request.json()
    const routes = await cms.Fetch.routes(jsonData)
    return json(routes)
}