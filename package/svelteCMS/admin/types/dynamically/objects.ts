/** Object data for objects inside route:posts */
export type PostsObjectData = {
    status:"public"|"private"
    title:string
    slug:string
    content:any
    image:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}

/** Object data for objects inside route:blogs */
export type BlogsObjectData = {
    status:"public"|"private"
    title:string
    slug:string
    content:any
    image:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}

/** Object data for objects inside route:videos */
export type VideosObjectData = {
    status:"public"|"private"
    title:string
    slug:string
    content:any
    image:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}

/** Object data for objects inside route:users */
export type UsersObjectData = {
    status:"public"|"private"
    firstName:string
    lastName:string
    email:string
    image:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}