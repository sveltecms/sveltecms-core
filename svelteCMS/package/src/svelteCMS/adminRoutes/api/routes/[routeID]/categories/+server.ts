import cms from "$Cms"
import { json } from "@sveltejs/kit"
import type { FetchCategoriesLoad } from "$Types/cms"
import type { RequestHandler } from "./$types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:FetchCategoriesLoad = await request.json()
    const categories = await cms.Fetch.categories(jsonData)
    return json(categories)
}