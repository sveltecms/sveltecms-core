/** Object data for objects inside route:pages */
export type PagesObjectData = {
    title:string
    slug:string
    content:any
}

/** Object data for objects inside route:posts */
export type PostsObjectData = {
    title:string
    slug:string
    content:any
    thumbnail:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}

/** Object data for objects inside route:javascript-frameworks */
export type Javascript-frameworksObjectData = {
    status:"public"|"private"
    name:string
    slug:string
    url:string
    views:number
    logo:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}

/** Object data for objects inside route:test */
export type TestObjectData = {
    status:"public"|"private"
    test:string
    img:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}