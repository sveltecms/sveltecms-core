/** Object data for objects inside route:products */
export type ProductsObjectData = {
    title:string
    slug:string
    description:string
    content:any
    brand:string
    thumbnail:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}

/** Object data for objects inside route:posts */
export type PostsObjectData = {
    title:string
    slug:string
    description:string
    content:any
    thumbnail:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}