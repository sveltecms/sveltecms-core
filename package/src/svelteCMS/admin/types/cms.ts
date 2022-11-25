import type { AssetData } from "$Packages/fileUploader/types"
import type { RouteData, UserData } from "$Types"
import type { ObjectId } from "mongodb"

/** Data needed to fetch single route */
export type FetchRouteLoad = { _id:ObjectId } | { ID:string } | { title:string } | { [key:string]:any } | {}
/** Data returned from fetching route */
export type FetchRouteRes = RouteData|null
/** Data needed to fetch routes */
export interface FetchRoutesLoad {
    filter:{ _id:ObjectId } | { ID:string } | { title:string } | { [key:string]:any } | {}
    count:number
    pageNumber?:number
}
/** Data returned from fetching route */
export type FetchRoutesRes = RouteData[]

/** Data needed to fetch single asset */
export type FetchAssetLoad = { _id:ObjectId } | { name:any } | {}
/** Data returned from fetching asset */
export type FetchAssetRes = AssetData|null
/** Data needed to fetch assets */
export interface FetchAssetsLoad {
    filter:{ _id:ObjectId } | { name:any } | {}
    count:number
    pageNumber?:number
}
/** Data returned from fetching assets */
export type FetchAssetsRes = AssetData[]

/** Data needed to fetch single asset */
export type FetchUserLoad = { _id:ObjectId } | { email:string } | { [key:string]:any } | {}
/** Data returned from fetching user */
export type FetchUserRes = UserData|null
/** Data needed to fetch users */
export interface FetchUsersLoad {
    filter:{ _id:ObjectId } | { email:string } | { [key:string]:any } | {}
    count:number
    pageNumber?:number
}
/** Data returned from fetching users */
export type FetchUsersRes = UserData[]