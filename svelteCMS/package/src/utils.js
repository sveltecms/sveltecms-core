// @ts-check
import { execSync } from "child_process"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import inquirer from "inquirer"

/** Root user password */
const rootUserPassword = await bcrypt.hash("sveltecms.dev",10)

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
    /** Default root users */
    rootUser:{
        _id: new ObjectId("111d45db1000c382457b0111"),
        firstName:"root",
        lastName:"user",
        email:"root@sveltecms.dev",
        password:rootUserPassword,
        image:{
            _id: "111d45db1000c382457b0111",
            name: "No image",
            path: "no-image.jpeg",
            type: "image",
            extension: "jpeg"
        },
        verified:true,
        role:"root"
    }
}

/** Console.log red and green logs */
export const log = {
    red(string=''){ console.log(`\x1b[31m${string}\x1b[0m`) },
    green(string=''){ console.log(`\x1b[32m${string}\x1b[0m`) }
}

/** Check if database installed */
export function dbInstalled(command){
    try{ execSync(command) ; return true }
    catch{ return false }
}

/** Ask choices question
 * @param {string} message - Message to display
 * @param {string[]} choices - List of questions 
*/
export async function askChoices(message,choices) {
    return inquirer.prompt({
        name:"answer", type:"list",
        message,choices
    })
}

/** Ask input question
 * @param {string} message - Message to display
*/
export async function askQuestion(message) {
    return inquirer.prompt({
        name:"answer", type:"input", message
    })
}