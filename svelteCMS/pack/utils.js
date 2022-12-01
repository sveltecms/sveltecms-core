// @ts-check
import fs from "fs"
import svelteConfig from "../../svelte.config.js"

const CWD = process.cwd()

/** List of dependencies to include to package */
const includeDependencies = [
    "sass","mongodb","slugify",
]

/** Get needed dependencies for package */
export function getNeededDependencies(){
    const localPackageJsonPath = `${CWD}/package.json`
    const localPackageJsonData = JSON.parse(fs.readFileSync(localPackageJsonPath).toString())
    /** @type {any} */
    const allDependencies = { devDependencies:[],dependencies:[] }
    // Loop all dev dependencies
    for(const [dependencyName,dependencyValue] of Object.entries(localPackageJsonData['devDependencies'])){
        // If need to include current dependency
        if(includeDependencies.includes(dependencyName)){
            allDependencies['devDependencies'].push({ [dependencyName]:dependencyValue })
        }
    }
    // Loop all dependencies
    for(const [dependencyName,dependencyValue] of Object.entries(localPackageJsonData['dependencies'])){
        // If need to include current dependency
        if(includeDependencies.includes(dependencyName)){
            allDependencies['dependencies'].push({ [dependencyName]:dependencyValue })
        }
    }
    return allDependencies
}

/** Get needed alias for package */
export function getNeededAlias(){
    // @ts-ignore
    const alias = Object.entries(svelteConfig.kit.alias)
    return alias
}