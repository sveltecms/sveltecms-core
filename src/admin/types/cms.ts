import type { AssetData } from "$Packages/fileUploader/types"
import type { ObjectId } from "mongodb"

/** Data needed to fetch single route */
export type FetchRouteLoad = { _id:ObjectId } | { ID:string } | { title:string } | { [key:string]:any } | {}
/** Data needed to fetch routes */
export interface FetchRoutesLoad {
    filter:{ _id:ObjectId } | { ID:string } | { title:string } | { [key:string]:any } | {}
    count:number
    pageNumber?:number
}

/** Data needed to fetch single asset */
export type FetchAssetLoad = { _id:ObjectId } | { name:any } | {}
/** Data needed to fetch assets */
export interface FetchAssetsLoad {
    filter:{ _id:ObjectId } | { name:any } | {}
    count:number
    pageNumber?:number
}
/** Data returned from fetch assets */
export type FetchAssetRes = AssetData[]

/** Data needed to fetch single asset */
export type FetchUserLoad = { _id:ObjectId } | { email:string } | { [key:string]:any } | {}
/** Data needed to fetch users */
export interface FetchUsersLoad {
    filter:{ _id:ObjectId } | { email:string } | { [key:string]:any } | {}
    count:number
    pageNumber?:number
}