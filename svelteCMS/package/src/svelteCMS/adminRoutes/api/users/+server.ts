import cms from "$Cms"
import { json } from "@sveltejs/kit"
import type { FetchUsersLoad } from "$Types/cms"
import type { RequestHandler } from "./$types"

export const POST:RequestHandler = async({request})=>{   
    const jsonData:FetchUsersLoad = await request.json()
    const users = await cms.Fetch.users(jsonData)
    return json(users)
}