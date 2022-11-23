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