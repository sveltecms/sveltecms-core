import db from "$Database"
import svelteCMS from "$svelteCMS"
import { ROUTES,CATEGORIES_ROUTES,TAGS_ROUTES } from "$Stores"
import { capitalize,getElementType } from "$Utils"
import { dev as isDevMode } from "$app/environment"
import { writeFileSync } from "fs"
import type { RouteData } from "$Types"
import type { LayoutServerLoad } from "./$types"

export const load:LayoutServerLoad = async()=>{
    /** List of routes that include categories */
    const categoriesRoutes:string[] = []
    /** List of routes that include tags */
    const tagsRoutes:string[] = []
    // Database queries
    const routesCollection = db.collection(svelteCMS.config.routesCollectionName)
    const routesCursor:any = routesCollection.find({}).limit(5)
    const routesDB:any = await routesCursor.map((data:any)=>{data['_id']=data['_id'].toString();return data}).toArray()
    const routes:RouteData[] = routesDB
    // Get routes that includes categories and tags
    for(const route of routes){
        if(route.includeCategories) categoriesRoutes.push(route.ID)
        if(route.includeTags) tagsRoutes.push(route.ID)
    }
    // Set server stores
    ROUTES.set(routes)
    CATEGORIES_ROUTES.set(categoriesRoutes)
    TAGS_ROUTES.set(tagsRoutes)
    // Auto generate types on dev mode
    if(isDevMode && routes.length>0) makeRoutesTypes(routes)
    // Return objects
    return { routes:routes,categoriesRoutes,tagsRoutes } 
}
 
/** Auto make types for object */
function makeRoutesTypes(routes:RouteData[]){
    /** All the routes objects */
    let objectsTypes = ""
    for(const route of routes){
        // Loop elements in route
        let objectType = `/** Object data for objects inside route:${route.ID} */\nexport type ${capitalize(route.ID)}ObjectData = {\n`
        for(const element of route.elements){
            const IDtype = getElementType(element.type)
            objectType+=`    ${element.ID}:${IDtype}\n`
        }
        // Complete object type for current route
        objectType+="}"
        // Add object type to objects type
        objectsTypes+=`${objectType}\n\n`
    }
    // Save types
    const typePath = `${process.cwd()}/src/admin/types/dynamically/objects.ts`
    const typeData = objectsTypes.trimEnd()
    writeFileSync(typePath,typeData)
}

