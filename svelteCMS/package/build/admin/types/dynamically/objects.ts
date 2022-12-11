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