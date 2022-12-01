// @ts-check
/** Make fast update to all files */
import { readdirSync } from "fs"
import path from "path"
import fs from "fs"
import { globby } from "globby"

// const srcFilesList = await globby("./src/",{expandDirectories:{files: ['*.ts','*.js','*.svelte']}})
// for(const filePath of srcFilesList){
//     const fileData = fs.readFileSync(filePath).toString()
//     // Rename data-sveltekit
//     if(fileData.includes("data-sveltekit-preload-code")){
//         const newFileData = fileData.replace(/data-sveltekit-preload-code/g,"data-sveltekit-preload-data")
//         fs.writeFileSync(filePath,newFileData)
//         console.log(filePath,"updated")
//     }
// }

const srcFilesList = await globby("./",{expandDirectories:{files: ['*.js']}})
for(const filePath of srcFilesList){
    const fileData = fs.readFileSync(filePath).toString()
    if(fileData.includes("$svelteCMS")){
        console.log(filePath)
    }
}