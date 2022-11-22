// @ts-check
import fs from "fs"
import { execSync } from "child_process"

const CWD = process.cwd()
/** src path */
const srcPath = `${CWD}/src`
/** svelteCMS package path */
const svelteCMSPackagePath = `${CWD}/package/src/svelteCMS`
/** svelteCMS json config path */
const svelteConfigJsonPath = `${svelteCMSPackagePath}/config.json`
/** svelteCMS initial config data */
const svelteConfigJsonData = { alias:{},devDependencies:{},dependencies:{} }
/** Path to svelte.config.js */
const svelteConfigPath = `${CWD}/svelte.config.js`
const svelteConfigData = fs.readFileSync(svelteConfigPath).toString()
const svelteCMSAlias = svelteConfigData.split("//<svelteCMSAlias>\n")[1].split("//</svelteCMSAlias>")[0].trimEnd()
// package json
const sveltePackageJsonPath = `${CWD}/package.json`
const sveltePackageJsonData = JSON.parse(fs.readFileSync(sveltePackageJsonPath).toString())
const svelteDependencies = sveltePackageJsonData['dependencies']
const svelteDevDependencies = sveltePackageJsonData['devDependencies']
// Add data to json data
svelteConfigJsonData['alias'] = svelteCMSAlias
svelteConfigJsonData['dependencies'] = svelteDependencies
svelteConfigJsonData['devDependencies'] = svelteDevDependencies

/** Check if svelteCMS folder exists */
const svelteCMSExist = fs.existsSync(svelteCMSPackagePath)
// If svelteCMS folder exists, remove it
if(svelteCMSExist) fs.rmSync(svelteCMSPackagePath,{recursive:true})
// Create svelteCMS folder
fs.mkdirSync(svelteCMSPackagePath)

// Copy admin folder to svelteCMS package
execSync(`cp -a ${srcPath}/admin/ ${svelteCMSPackagePath}/admin/`)
// Copy admin routes folder to svelteCMS package
execSync(`cp -a ${srcPath}/routes/admin/ ${svelteCMSPackagePath}/adminRoutes/`)
// Copy admin static folder to svelteCMS package
execSync(`cp -a ${CWD}/static/admin/ ${svelteCMSPackagePath}/adminStatic/`)

// Make assets folder and sub folders
fs.mkdirSync(`${svelteCMSPackagePath}/assets/`)
fs.mkdirSync(`${svelteCMSPackagePath}/assets/images/`)
fs.mkdirSync(`${svelteCMSPackagePath}/assets/videos/`)
fs.mkdirSync(`${svelteCMSPackagePath}/assets/audios/`)
fs.mkdirSync(`${svelteCMSPackagePath}/assets/other/`)
fs.writeFileSync(`${svelteCMSPackagePath}/assets/images/.gitkeep`,"")
fs.writeFileSync(`${svelteCMSPackagePath}/assets/videos/.gitkeep`,"")
fs.writeFileSync(`${svelteCMSPackagePath}/assets/audios/.gitkeep`,"")
fs.writeFileSync(`${svelteCMSPackagePath}/assets/other/.gitkeep`,"")

// Save svelteCMS config json
fs.writeFileSync(svelteConfigJsonPath,JSON.stringify(svelteConfigJsonData,null,4))