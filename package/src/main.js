#! /usr/bin/env node
// @ts-check
import fs from "fs"
import { execSync } from "child_process"
import { defaultData,dbInstalled, log } from "./utils.js"
import { MongoClient } from "mongodb"

const CWD = process.cwd()
const DATABASE_PROVIDER = "mongodb"
/** find database url from argv */
const dbUrlFounded = process.argv.find(data=>data.includes("--dbUrl"))
/** project database url */
const databaseUrl = dbUrlFounded&&dbUrlFounded.includes("=") ? dbUrlFounded.split("=")[1].trim() : null
/** .env path of current project */
const projectEnvPath = `${CWD}/.env`
const projectSvelteConfigPath = `${CWD}/svelte.config.js`
let projectSvelteConfigData = fs.readFileSync(projectSvelteConfigPath).toString()
/** svelteCMS folder path inside npx */
const svelteCMSPath = `${process.argv[1].replace(".bin/","")}/src/svelteCMS`
// const svelteCMSPath = `${CWD}/package/src/svelteCMS` // TEMP
const svelteCMSConfigObject = JSON.parse(fs.readFileSync(`${svelteCMSPath}/config.json`).toString())

// Set database url if it was provided
defaultData.envs['DATABASE_URL'] = databaseUrl ? databaseUrl : defaultData.envs['DATABASE_URL']

/** Main function to run codes */
async function Main(){
    const isDatabaseInstalled = dbInstalled()
    // If database is not installed stop function
    if(!isDatabaseInstalled){
        log.red(`Look like ${DATABASE_PROVIDER} is not installed or not running`)
        return
    }
    // Else run code to next step

    /** Check if .env file exists */
    const envFileExists = fs.existsSync(projectEnvPath)
    // Create .env file
    if(!envFileExists) fs.writeFileSync(projectEnvPath,"")
    /** Project env file data */
    const envFileData = fs.readFileSync(projectEnvPath).toString()
    for(const [envName,envValue] of Object.entries(defaultData.envs)){
        const envExists = envFileData.includes(envName)
        // Add env to env file, if it do not exists
        if(!envExists) fs.appendFileSync(projectEnvPath,`${envName}="${envValue}"\n`)
    }

    /** Check if svelte.config includes alias */
    const hasAlias = projectSvelteConfigData.includes("alias")
    const svelteConfigHasAlias = projectSvelteConfigData.includes("$svelteCMS")
    if(hasAlias && !svelteConfigHasAlias){
        // @ts-ignore
        let alias = `config['kit']['alias'] = {\n${svelteCMSConfigObject['alias']}\n}`.replaceAll("            ","     ")
        alias+=`\nconfig['onwarn']=(warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); }`
        projectSvelteConfigData = projectSvelteConfigData.replace("export default",`${alias}\nexport default`)
    }else if(!svelteConfigHasAlias){
        // @ts-ignore
        let alias = `config['kit']['alias'] = {\n${svelteCMSConfigObject['alias']}\n}`.replaceAll("            ","     ")
        alias+=`\nconfig['onwarn']=(warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); }`
        projectSvelteConfigData = projectSvelteConfigData.replace("export default",`${alias}\nexport default`)
    }
    // Save svelte.config.js
    fs.writeFileSync(projectSvelteConfigPath,projectSvelteConfigData)

    // Project Package.json
    const projectPackageJsonPath = `${CWD}/package.json`
    const projectPackageJsonObjectData = JSON.parse(fs.readFileSync(projectPackageJsonPath).toString())
    const projectDependencies = projectPackageJsonObjectData['dependencies']
    const projectDevDependencies = projectPackageJsonObjectData['devDependencies']
    if(projectDependencies){
        for(const [dName,dValue] of Object.entries(projectDependencies)){
            const dependenciesExists = dName in svelteCMSConfigObject['dependencies']
            // If dependency exists in svelteCMS dependencies remove it
            if(dependenciesExists) delete svelteCMSConfigObject['dependencies'][dName]
        }
    }
    for(const [dName,dValue] of Object.entries(projectDevDependencies)){
        const dependenciesExists = dName in svelteCMSConfigObject['devDependencies']
        // If dependency exists in svelteCMS dev dependencies remove it
        if(dependenciesExists) delete svelteCMSConfigObject['devDependencies'][dName]
    }
    // If project do not has any dependencies, add default
    if(!projectDependencies) projectPackageJsonObjectData['dependencies'] = {}
    projectPackageJsonObjectData['dependencies'] = {
        ...projectPackageJsonObjectData['dependencies'],
        ...svelteCMSConfigObject['dependencies']
    }
    // Marge devDependencies
    projectPackageJsonObjectData['devDependencies'] = {
        ...projectPackageJsonObjectData['devDependencies'],
        ...svelteCMSConfigObject['devDependencies']
    }
    // Save package.json
    fs.writeFileSync(projectPackageJsonPath,JSON.stringify(projectPackageJsonObjectData,null,4))

    // Copy needed folders
    log.green("Cloning admin folder")
    execSync(`cp -a ${svelteCMSPath}/admin/ ${CWD}/src/admin/`)
    log.green("Cloning admin routes folder")
    execSync(`cp -a ${svelteCMSPath}/adminRoutes/ ${CWD}/src/routes/admin/`)
    log.green("Cloning admin static folder")
    execSync(`cp -a ${svelteCMSPath}/adminStatic/ ${CWD}/static/admin/`)
    log.green("Cloning assets folder")
    // Create folder if it do not exists
    if(!fs.existsSync(`${CWD}/assets`)) fs.mkdirSync(`${CWD}/assets`)
    execSync(`cp -a ${svelteCMSPath}/assets/ ${CWD}/assets/`)
    // Add default asset to images
    fs.copyFileSync(`${svelteCMSPath}/adminStatic/no-image.jpeg`,`${CWD}/assets/images/no-image.jpeg`)

    // Create default asset in database
    const mongoClient = new MongoClient(defaultData.envs.DATABASE_URL)
    await mongoClient.connect()
    const database = mongoClient.db(defaultData.envs.DATABASE_NAME)
    const assetsCollection = database.collection("__assets")
    const usersCollection = database.collection("__users")
    // Create default asset
    await assetsCollection.insertOne(defaultData.asset)
    // Create default root admin
    await usersCollection.insertOne(defaultData.rootUser)
    // Close db connection
    await mongoClient.close()
    log.green("svelteCMS was installed")
    log.green("running npm install, please wait")
    execSync("npm install")
    log.green("All done\n    run: npm run dev")
}
Main()