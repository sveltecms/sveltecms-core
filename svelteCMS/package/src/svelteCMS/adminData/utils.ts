import slugify from "slugify"
import svelteCMS from "$svelteCMS"
import type { RouteLoad,RouteData,ElementData,ElementType,CategoryData,CategoryLoad, TagLoad, TagData,UserLoad, UserData,LinkedAssetData } from "./types"

/** Covert MongoDB ObjectID to string */
export function objectIdToString(objectId:any){
    return objectId.toString()
}

/** Validate tag data */
export function validateTag(tag:TagLoad|TagData){
    const errors:string[] = []
    if(tag.name.trim().length===0) errors.push(`Tag name can not be empty`)
    if(tag.slug.trim().length===0) errors.push(`Tag slug can not be empty`)
    if(tag.description.trim().length===0) errors.push(`Tag description can not be empty`)
    return errors
}

/** Validate new user data */
export function validateNewUser(userData:UserLoad|UserData){
    const errors:string[] = []
    if(userData.firstName.trim().length===0) errors.push(`User first name can not be empty`)
    if(userData.lastName.trim().length===0) errors.push(`User last name can not be empty`)
    if(userData.email.trim().length===0) errors.push(`User email can not be empty`)
    if(userData.password.trim().length===0) errors.push(`User password can not be empty`)
    return errors
}

/** Validate category data */
export function validateCategory(category:CategoryLoad|CategoryData){
    const errors:string[] = []
    if(category.name.trim().length===0) errors.push(`Category name can not be empty`)
    if(category.slug.trim().length===0) errors.push(`Category slug can not be empty`)
    if(category.description.trim().length===0) errors.push(`Category description can not be empty`)
    return errors
}

/** Validate new object before publishing it */
export function validateNewObject(elements:ElementData[]){
    const errors:string[] = []
    // Loop all elements
    for(const element of elements){
        if(element.value!==0 && !element.value){
            errors.push(`${element.name} is required`)
        }
    }
    return errors
}

/** Validate new route before publishing it */
export function validateNewRoute(route:RouteData|RouteLoad){
    const errors:string[] = []
    // Validate route ID
    if(route.ID.trim()==="") errors.push("Route: ID can not be empty.")
    // Validate route title
    if(route.title.trim()==="") errors.push("Route: title can not be empty.")
    // Validate meta info
    if(route.meta.title.trim()==="") errors.push("Meta: title can not be empty.")
    if(route.meta.desc.trim()==="") errors.push("Meta: description can not be empty.")
    // Validate elements, it must be 1 or more
    if(route.elements.length===0) errors.push("Route: need a minimum of 1 element.")
    // Return any error
    return errors
}

/** Validate new element */
export function validateNewElement(elements:ElementData[]){
    const errors:string[] = []
    for(const element of elements){
        // If element is required and value is false, add to errors
        if(element.value!==0 && !element.value){
            errors.push(`Element value for:${element.name} is required`)
        }
    }
    // Return any error
    return errors
}

/** Generate url slug from string */
export function newSlug(data:string){
    return slugify(data,{strict:true,lower:true})
}

/** Capitalize string */
export function capitalize(data:string){
    return data.charAt(0).toUpperCase()+data.slice(1)
}

/** Get real value for element value using element type */
export function getRealValue(data:ElementType){
    const realValues = {
        status:"public",textArea:"textArea",input:"input",
        inputNumber:0,slug:"slug",content:"Object content",image:null
    }
    // @ts-ignore
    return realValues[data]
}

/** Wait for given milliseconds */
export function wait(time:number){
    return new Promise(r=>setTimeout(r,time))
}

/** Send post request with json body, it uses Config.apiBasePath */
export async function post(apiPath:string,body:any) {
    const request = await fetch(svelteCMS.config.apiBasePath+apiPath,{ method:"POST",body:body })
    return request.json() 
}

/** Send post request with json body, it uses Config.apiBasePath */
export async function postJson(apiPath:string,body:Object) {
    const request = await fetch(svelteCMS.config.apiBasePath+apiPath,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(body)
    })
    return request.json() 
}

/** Send post request with json body using svelte fetch, it uses Config.apiBasePath */
export async function sveltePostJson(fetch:any,apiPath:string,body:Object) {
    const request = await fetch(svelteCMS.config.apiBasePath+apiPath,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(body)
    })
    return request.json() 
}

/** Get svelte store value, we use it for server side codes */
export async function getStoreData(store:any,routeID:any):Promise<any>{
    return new Promise(resolve=>{
        store.subscribe((data:any)=>{
            const routeData = data.find((d:any)=>d.ID===routeID)
            resolve(routeData)
        })
    })
}

/** Get svelte store value, we use it for server side codes */
export async function getStoreData2(store:any):Promise<any>{
    return new Promise(resolve=>{
        store.subscribe((data:any)=>{
            resolve(data)
        })
    })
}

/** Get svelte store value, we use it for server side codes */
export async function storeData(store:any):Promise<any>{
    return new Promise(resolve=>{
        store.subscribe((data:any)=>{
            resolve(data)
        })
    })
}

/** Convert elements list to JavaScript Object use for /admin/routes/objects/new */
export function elementsToObject(elements:ElementData[]){
    const object:{[key:string]:any} = {}
    // Loop elements and set key and it's value
    for(const element of elements){
        object[element.ID] = element.value
    }
    // Return object
    return object
}

/** Get element type from type(string) */
export function getElementType(type:ElementType){
    const types = {
        status:`"public"|"private"`,
        textArea:`string`,
        input:`string`,
        inputNumber:`number`,
        slug:`string`,
        content:`any`,
        image:`{\n        _id:string\n        name:string\n        path:string\n        type:string\n        extension:string\n    }`,
    }
    // @ts-ignore
    return types[type]
}