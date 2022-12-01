#! /usr/bin/env node
// @ts-check
import fs from "fs"
import { execSync } from "child_process"
import { defaultData,dbInstalled, log, askChoices, askQuestion } from "./utils.js"
import db from "./db.js"

const CWD = process.cwd()
const SVELTE_CMS_PATH = `${process.argv[1].replace(".bin/","")}/src/svelteCMS`
// const SVELTE_CMS_PATH = `${CWD}/package/src/svelteCMS` // local only
const SVELTE_CMS_JSON_DATA_PATH = `${SVELTE_CMS_PATH}/data.json`
const SVELTE_CMS_JSON_DATA = JSON.parse(fs.readFileSync(SVELTE_CMS_JSON_DATA_PATH).toString())
const DOT_SVELTE_CMS_PATH = `${CWD}/.svelteCMS`
const ASSETS_PATH = `${DOT_SVELTE_CMS_PATH}/assets`
let PROJECT_NAME = "svelteCMS"
let DATABASE_URL = "mongodb://localhost:27017/"
let DATABASE_NAME = "svelteCMS"
let DATABASE_SOURCE = "mongoDB"

async function Main(){
    const updatingQ = await askChoices("Are you updating svelteCMS ?",["no","yes"])

    // Ask for project name, when new install
    if(updatingQ.answer==="no"){
        // Ask for project name
        const projectNameQ = await askQuestion("What should we name this project ?")
        PROJECT_NAME = projectNameQ.answer
        // Ask for database
        const databaseSourceQ = await askChoices("What database would you like to use ?",["mongoDB"])
        DATABASE_SOURCE = databaseSourceQ.answer
        // Stop if database is not installed
        const isDbInstalled = dbInstalled("mongod --version")
        if(!isDbInstalled){
            log.red("Looks like you do not have mongoDB install")
            console.log("You can always change DATABASE_URL later editing .env file")
            const stopQ = await askChoices("Would you like to continue ?",["no","yes"])
            if(stopQ.answer==="no") return
        }
    }


    // Create .svelteCMS if not exists
    if(!fs.existsSync(DOT_SVELTE_CMS_PATH)) fs.mkdirSync(DOT_SVELTE_CMS_PATH)
    // Clone admin data
    log.green("Cloning admin folder")
    execSync(`cp -a ${SVELTE_CMS_PATH}/adminData/ ${CWD}/src/admin/`)
    // Clone admin routes
    log.green("Cloning admin routes folder")
    execSync(`cp -a ${SVELTE_CMS_PATH}/adminRoutes/ ${CWD}/src/routes/admin/`)
    // Clone admin static
    log.green("Cloning admin static folder")
    execSync(`cp -a ${SVELTE_CMS_PATH}/adminStatic/ ${CWD}/static/admin/`)
    // Clone assets folder
    log.green("Cloning assets folder")
    execSync(`cp -a ${SVELTE_CMS_PATH}/assets/ ${ASSETS_PATH}/`)
    // Clone static folder to .svelteCMS
    log.green("Cloning assets folder")
    // Add default asset to images
    fs.copyFileSync(`${SVELTE_CMS_PATH}/adminStatic/no-image.jpeg`,`${ASSETS_PATH}/images/no-image.jpeg`)


    // Create root user and default asset if needed
    // Run if new install and database is mongoDB only
    if(DATABASE_SOURCE==="mongoDB" && updatingQ.answer==="no"){
        const database = await db.mongoDB()
        const isRootUser = await database.usersCollection.findOne({ email:"root@sveltecms.dev"})
        const isDefaultAsset = await database.usersCollection.findOne({ _id:defaultData.asset._id})
        if(!isRootUser) await database.usersCollection.insertOne(defaultData.rootUser)
        if(!isDefaultAsset) await database.assetsCollection.insertOne(defaultData.asset)
        await database.mongoClient.close()
        // Update database name
        DATABASE_NAME = database.dbName
    }
    

    // Handle .env file
    const dotEnvFilePath = `${CWD}/.env`
    const dotEnvFilePathExist = fs.existsSync(dotEnvFilePath)
    // If .env file exists and it's a new install
    if(dotEnvFilePathExist){
        const dotEnvOldData = fs.readFileSync(dotEnvFilePath).toString()
        let dotEnvNewData = ""
        if(!dotEnvOldData.includes(`DATABASE_URL="${DATABASE_URL}"`)) dotEnvNewData+=`\nDATABASE_URL="${DATABASE_URL}"`
        if(!dotEnvOldData.includes(`DATABASE_NAME="${DATABASE_NAME}"`)) dotEnvNewData+=`\nDATABASE_NAME="${DATABASE_NAME}"`
        fs.appendFileSync(dotEnvFilePath,dotEnvNewData)
    }
    // Else if new install and .env do not exists
    else if(!dotEnvFilePathExist){
        fs.appendFileSync(dotEnvFilePath,`DATABASE_URL="${DATABASE_URL}"\nDATABASE_NAME="${DATABASE_NAME}"`)
    }


    // Handle package.json dependencies
    /** Current project's package json path */
    const projectPackageJsonPath = `${CWD}/package.json`
    const projectJsonData = JSON.parse(fs.readFileSync(projectPackageJsonPath).toString())
    // Loop svelteCMS dependencies and add if needed, to project package json
    const svelteCMSDependencies = SVELTE_CMS_JSON_DATA['dependencies']['dependencies']
    const svelteCMSDevDependencies = SVELTE_CMS_JSON_DATA['dependencies']['devDependencies']
    for(const dependency of svelteCMSDependencies){
        const dependencyName = Object.keys(dependency)[0]
        const dependencyValue = dependency[dependencyName]
        // Check if dependency do not exists in project package.json
        // If not add new dependency
        if(!projectJsonData['dependencies']) projectJsonData['dependencies']={}
        if(!projectJsonData['dependencies'].hasOwnProperty(dependencyName)){
            projectJsonData['dependencies'][dependencyName] = dependencyValue
        }
    }
    for(const dependency of svelteCMSDevDependencies){
        const dependencyName = Object.keys(dependency)[0]
        const dependencyValue = dependency[dependencyName]
        // Check if dependency do not exists in project package.json
        // If not add new dependency
        if(!projectJsonData['devDependencies']) projectJsonData['devDependencies']={}
        if(!projectJsonData['devDependencies'].hasOwnProperty(dependencyName)){
            projectJsonData['devDependencies'][dependencyName] = dependencyValue
        }
    }
    // Save project package.json
    fs.writeFileSync(projectPackageJsonPath,JSON.stringify(projectJsonData,null,4))


    // Handle alias
    const svelteCMSAlias = SVELTE_CMS_JSON_DATA['alias']
    /** Current project's package json path */
    const projectSvelteConfigPath = `${CWD}/svelte.config.js`
    const projectSvelteConfigData = fs.readFileSync(projectSvelteConfigPath).toString()
    let svelteCMSAliasString = ''
    for(const alia of svelteCMSAlias){
        const aliaName = alia[0]
        const aliaValue = alia[1]
        svelteCMSAliasString+=`    ${aliaName}:"${aliaValue}",\n`
    }
    svelteCMSAliasString = `// <svelteCMS>\nconfig['kit']['alias'] = {\n${svelteCMSAliasString}\n}`
    svelteCMSAliasString+= "\nconfig['onwarn']=(warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); }\n// </svelteCMS>"
    if(projectSvelteConfigData.includes("// <svelteCMS>")){
        const dataToReplace = "// <svelteCMS>"+projectSvelteConfigData.split("// <svelteCMS>")[1].split("// </svelteCMS>")[0]+"// </svelteCMS>"
        const newProjectSvelteConfigData = projectSvelteConfigData.replace(dataToReplace,svelteCMSAliasString)
        fs.writeFileSync(projectSvelteConfigPath,newProjectSvelteConfigData)
    }else{
        const newProjectSvelteConfigData = projectSvelteConfigData.replace(`export default config;`,`${svelteCMSAliasString}\nexport default config;`)
        fs.writeFileSync(projectSvelteConfigPath,newProjectSvelteConfigData)
    }


    log.green("running npm install, please wait")
    execSync("npm install")
    log.green("All done\n    run: npm run dev")
}
Main()