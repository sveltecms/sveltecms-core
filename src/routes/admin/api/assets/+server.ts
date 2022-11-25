import cms from "$Cms"
import { json } from "@sveltejs/kit"
import type { FetchAssetsLoad } from "$Types/cms"
import type { RequestHandler } from "./$types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:FetchAssetsLoad = await request.json()
    const assets = await cms.Fetch.assets(jsonData)
    return json(assets)
}