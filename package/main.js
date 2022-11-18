#! /usr/bin/env node
import fs from "fs"
import { execSync } from "child_process"

const FIND_DB_URL = process.argv.find(data=>data.includes("--dbUrl"))
const DB_URL = FIND_DB_URL ? FIND_DB_URL.includes('=') ? FIND_DB_URL.split("=")[1].trim() : null : null
const CWD = process.cwd()
const SRC_PATH = `${CWD}/src`
const SVELTE_CONFIG_PATH = `${CWD}/svelte.config.js`
const DOT_ENV_PATH = `${CWD}/.env`
const SVELTE_CMS_BUILD_PATH = `${process.argv[1].replace(".bin/","")}/svelteCMS`
const DOT_ENV_VARIABLES = {
    DATABASE_URL: DB_URL ? DB_URL:"mongodb://localhost:27017/",
    DATABASE_NAME: `svelteCMS_${Date.now()}`
}
const PACKAGE_JSON_DATA = JSON.parse(fs.readFileSync(`${SVELTE_CMS_BUILD_PATH}/dependencies.json`).toString())
const DEV_DEPENDENCIES = PACKAGE_JSON_DATA['devDependencies']
const DEPENDENCIES = PACKAGE_JSON_DATA['dependencies']

// Copy folder to project src
console.log("Cloning admin folders")
execSync(`cp -a ${SVELTE_CMS_BUILD_PATH}/admin/ ${SRC_PATH}/admin/`)
execSync(`cp -a ${SVELTE_CMS_BUILD_PATH}/adminRoutes/ ${SRC_PATH}/routes/admin/`)

const PROJECT_ASSETS_PATH = `${CWD}/assets`
// Check if assets folder exists, if yes delete it and create
if(fs.existsSync(PROJECT_ASSETS_PATH)) fs.rmSync(PROJECT_ASSETS_PATH,{recursive:true,force:true})
console.log("Making assets folder and sub folders")
// Make assets folder and sub folders
fs.mkdirSync(PROJECT_ASSETS_PATH)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/audios/`)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/images/`)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/videos/`)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/other/`)

// Copy admin static assets
const staticAdminAssetsPath = `${CWD}/static/admin/`
if(!fs.existsSync(staticAdminAssetsPath)) fs.mkdirSync(staticAdminAssetsPath)
console.log("Adding admin static folder")
execSync(`cp -a ${SVELTE_CMS_BUILD_PATH}/adminStatic/ ${staticAdminAssetsPath}`)

// Add aliases to svelte.config
console.log("Adding needed aliases to svelte.config.js")
const svelteConfigData = fs.readFileSync(SVELTE_CONFIG_PATH).toString()
const svelteAliases = `config['kit']['alias'] = {
    $svelteCMS:"src/admin/svelteCMS.ts",
    $Utils:"src/admin/utils.ts",
    $Stores:"src/admin/stores.ts",
    $Database:"src/admin/db.server.ts",
    $Types:"src/admin/types",
    $Comps:"src/admin/components/",
    $Elements:"src/admin/elements/",
    $Icons:"src/admin/icons/",
    $Packages:"src/admin/packages/"
}
config['onwarn']=(warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); }`
const newSvelteConfigData = svelteConfigData.replace("export default config",`${svelteAliases}\nexport default config`)
fs.writeFileSync(SVELTE_CONFIG_PATH,newSvelteConfigData)


console.log("Adding .env variables")
// Check if .env file exists
const envData = Object.keys(DOT_ENV_VARIABLES).map(keyName=>{ return `${keyName}="${DOT_ENV_VARIABLES[keyName]}"\n`}).join("")
if(!fs.existsSync(DOT_ENV_PATH)) fs.writeFileSync(DOT_ENV_PATH,envData)
else fs.appendFileSync(DOT_ENV_PATH,envData)

console.log("Adding devDependencies and dependencies")
// Add dependencies
const packageJsonData = JSON.parse(fs.readFileSync(`${CWD}/package.json`).toString())
const devDependencies = packageJsonData['devDependencies']
const dependencies = packageJsonData['dependencies']
for(const [dependency,dependencyData] of Object.entries(DEV_DEPENDENCIES)){
    if(!devDependencies.hasOwnProperty(dependency)){
        packageJsonData['devDependencies'][dependency] = dependencyData
    }
}
if(!dependencies) packageJsonData['dependencies']={}
for(const [dependency,dependencyData] of Object.entries(DEPENDENCIES)){
    if(!devDependencies.hasOwnProperty(dependency)){
        packageJsonData['dependencies'][dependency] = dependencyData
    }
}
fs.writeFileSync(`${CWD}/package.json`,JSON.stringify(packageJsonData,null,4))

console.log("Running npm install")
execSync(`npm i`)
console.log("Done")