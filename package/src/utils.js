import { execSync } from "child_process"
import { ObjectId } from "mongodb"

/** Default data */
export const defaultData = {
    /** Default asset */
    asset:{
        _id: new ObjectId("111d45db1000c382457b0111"),
        name: "No image",
        path: "no-image.jpeg",
        type: "image",
        extension: "jpeg"
    },
    envs:{
        DATABASE_URL:"mongodb://localhost:27017/",
        DATABASE_NAME:`svelteCMS_${Date.now()}`
    }
}

/** Console.log red and green logs */
export const log = {
    red(string=''){ console.log(`\x1b[31m${string}\x1b[0m`) },
    green(string=''){ console.log(`\x1b[32m${string}\x1b[0m`) }
}

/** Check if database installed */
export function dbInstalled(){
    try{ execSync("mongod --version") ; return true }
    catch{ return false }
}