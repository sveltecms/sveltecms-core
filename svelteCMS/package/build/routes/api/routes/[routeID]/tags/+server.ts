import cms from "$Cms"
import { json } from "@sveltejs/kit"
import type { FetchTagsLoad } from "$Types/cms"
import type { RequestHandler } from "./$types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:FetchTagsLoad = await request.json()
    const tags = await cms.Fetch.tags(jsonData)
    return json(tags)
}