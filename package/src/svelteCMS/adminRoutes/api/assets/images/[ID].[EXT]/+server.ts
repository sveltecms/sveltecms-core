import config from "../../config"
import type { RequestHandler } from "@sveltejs/kit"
import fs from "fs"

export const GET:RequestHandler = async({params})=>{
    // Get file info
    const { ID,EXT } = params
    const filePath = `${config.assetsDiskPath}/${ID}.${EXT}`
    // Check if file exists
    if(fs.existsSync(filePath)){
        const file = fs.readFileSync(filePath)
        const response = new Response(file)
        response.headers.append("Content-Type",`image/${EXT}`)
        return response
    }
    return new Response("File not founded")
}