// @ts-check
import fs from "fs"
import { getNeededDependencies,getNeededAlias } from "./utils.js"
import { execSync } from "child_process"

const CWD = process.cwd()
const localSrcPath = `${CWD}/src`
/** Path where svelteCMS will be packed to */
const svelteCMSPackagePath = `${CWD}/svelteCMS/package/src/svelteCMS`
/** Path save alias and dependencies */
const svelteCMSPackageJsonDataPath = `${CWD}/svelteCMS/package/src/svelteCMS/data.json`
/** List of dependencies needed to run svelteCMS */
const neededDependencies = getNeededDependencies()
const neededAlias = getNeededAlias()
/** Json with all dependencies and alias */
const svelteCMSPackageJsonData = {
    dependencies:neededDependencies,
    alias:neededAlias
}

// Drop svelteCMSPackagePath
if(fs.existsSync(svelteCMSPackagePath)) fs.rmdirSync(svelteCMSPackagePath, { recursive: true })
// Create svelteCMSPackagePath
fs.mkdirSync(svelteCMSPackagePath)
// Save svelteCMS json data
fs.writeFileSync(svelteCMSPackageJsonDataPath,JSON.stringify(svelteCMSPackageJsonData,null,4))

// copy admin data
execSync(`cp -a ${localSrcPath}/admin/ ${svelteCMSPackagePath}/adminData/`)
// copy admin routes
execSync(`cp -a ${localSrcPath}/routes/admin/ ${svelteCMSPackagePath}/adminRoutes/`)
// copy admin static folder
execSync(`cp -a ${CWD}/static/admin/ ${svelteCMSPackagePath}/adminStatic/`)
// copy sample assets
execSync(`cp -a ${CWD}/svelteCMS/pack/assets/ ${svelteCMSPackagePath}/assets/`)