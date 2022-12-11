import type { AssetData } from "$Packages/fileUploader/types"
import type { ObjectId } from "mongodb"

/** Routes key objects */
export type RoutesKeysData = {
    /** Route id = slug (unique) */
    [id:string]:RouteValueData
}

/** Routes key objects */
export type RoutesData = RoutesKeysData

/** Route object data */
export type RouteValueData = RouteData

/** Route object data needed to create or update route */
export type RouteLoad = {
    /** Route title */
    title:string
    /** Route id = slug (unique) */
    ID:string
    /** If yes we will generate a categories collection for route */
    includeCategories:"yes"|"no"
    /** If yes we will generate a tags collection for route */
    includeTags:"yes"|"no"
    /** Page info */
    meta:{ title:string, desc:string }
    /** Route elements that will be displayed */
    elements:ElementData[]
}

/** Route object data returned from route */
export interface RouteData extends RouteLoad  {
    /** MongoDB super key id */
    _id:any
}

/** Route element object data */
export type ElementData = {
    /** Unique id for each element */
    ID:string
    /** Name of element */
    name:string
    /** Type of element */
    type:ElementType
    /** Element value (data) */
    value:any
    /** DOM element only */
    domElement?:any
}

/** Elements types allow in route data */
export type ElementType = "status" | "textArea" | "input" | "inputNumber" | "slug" | "content" | "image" | "categories" | "tags"

/** Routes key objects */
export type ObjectData = {
    /** Any key and any value */
    [id:string]:any
    /** List of categories if it was selected */
    categories?:CategoryData[]
    /** List of tags if it was selected */
    tags?:TagLoad[]
}


/** Object data to create new category */
export type CategoryLoad = {
    /** Category name */
    name:string
    /** Category slug (unique) */
    slug:string
    /** Category description */
    description:string
    /** Category image(asset) */
    image:AssetData
}
/** Object data returned from category */
export interface CategoryData extends CategoryLoad {
    /** MongoDB super key id */
    _id:any
}
/** Object data to create new tag */
export type TagLoad = {
    /** Tag name */
    name:string
    /** Tag description */
    description:string
    /** Tag slug (unique) */
    slug:string
}
/** Object data returned from tag */
export interface TagData extends TagLoad {
    /** MongoDB super key id */
    _id:any
}

/** Route object data */
export type RouteObjectData = { _id?:any,[key:string]:any }

/** Data needed to create new user */
export type UserLoad = {
    firstName:string
    lastName:string
    email:string
    password:string
    image:AssetData
    verified:boolean
    role:"root"|"admin"|"user"
}
/** Data return from user object */
export interface UserData extends UserLoad{ _id:any }

/** Current project data */
export type ProjectData = {
    /** Should we allow new user to signUp */
    allowNewUser:boolean
    elementLinkedToAssetData:{ collection:any,element:any }
}

export type LinkedAssetLoad = {
    /** Collection name */
    collection:string
    /** Collection's element targeting */
    target:string
}
export interface LinkedAssetData extends LinkedAssetLoad {
    /** MongoDB _id */
    _id:ObjectId
}
export type LinkedCategoryLoad = {
    /** Collection name */
    collection:string
    /** Collection's element targeting */
    target:string
}
export interface LinkedCategoryData extends LinkedAssetLoad {
    /** MongoDB _id */
    _id:ObjectId
}
export type LinkedTagLoad = {
    /** Collection name */
    collection:string
    /** Collection's element targeting */
    target:string
}
export interface LinkedTagData extends LinkedAssetLoad {
    /** MongoDB _id */
    _id:ObjectId
}