import fs from "fs"
import { execSync } from "child_process"

const CWD = process.cwd()
const SRC_PATH = `${CWD}/src`
const ADMIN_PATH = `${SRC_PATH}/admin/`
const ADMIN_ROUTE_PATH = `${SRC_PATH}/routes/admin/`
const ADMIN_STATIC_PATH = `${CWD}/static/admin/`
const VERSION_PATH = `${CWD}/package/svelteCMS`
const PROJECT_ASSETS_PATH = `${VERSION_PATH}/assets`
const PACKAGE_JSON_DATA = JSON.parse(fs.readFileSync(`${CWD}/package.json`).toString())
const DEV_DEPENDENCIES = PACKAGE_JSON_DATA['devDependencies']
const DEPENDENCIES = PACKAGE_JSON_DATA['dependencies']

// Remove svelteSMC folder if exists 
if(fs.existsSync(VERSION_PATH)) fs.rmSync(VERSION_PATH,{recursive:true})
fs.mkdirSync(VERSION_PATH)
// Admin core
execSync(`cp -a ${ADMIN_PATH} ${VERSION_PATH}/admin/`)
// Admin routes
execSync(`cp -a ${ADMIN_ROUTE_PATH} ${VERSION_PATH}/adminRoutes/`)
execSync(`cp -a ${ADMIN_STATIC_PATH} ${VERSION_PATH}/adminStatic/`)

// Make assets folder and sub folders
fs.mkdirSync(PROJECT_ASSETS_PATH)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/audios/`)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/images/`)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/videos/`)
fs.mkdirSync(`${PROJECT_ASSETS_PATH}/other/`)
fs.writeFileSync(`${PROJECT_ASSETS_PATH}/audios/.gitkeep`,"")
fs.writeFileSync(`${PROJECT_ASSETS_PATH}/images/.gitkeep`,"")
fs.writeFileSync(`${PROJECT_ASSETS_PATH}/videos/.gitkeep`,"")
fs.writeFileSync(`${PROJECT_ASSETS_PATH}/other/.gitkeep`,"")
fs.copyFileSync(`${ADMIN_STATIC_PATH}/no-image.jpeg`,`${PROJECT_ASSETS_PATH}/images/no-image.jpeg`)

// Add dependencies
const dependenciesData = { devDependencies:DEV_DEPENDENCIES,dependencies:DEPENDENCIES }
fs.writeFileSync(`${VERSION_PATH}/dependencies.json`,JSON.stringify(dependenciesData,null,4))