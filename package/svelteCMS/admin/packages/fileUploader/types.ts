/** Data need to upload new asset */
export interface AssetLoad {
    name:string
    path:string
    type:"image"|"video"|"other"
    extension:string
}

/** Search assets target asset name */
export interface SearchLoad { assetName:string }
/** Data need to upload new asset */
export interface AssetData extends AssetLoad {  _id:any }

/** Response from new asset created */
export type ApiResponse = {
    ok:false,
    msg:string
} | {
    ok:true,
    msg:string
    _id:any
    name:string
    path:string
    type:"image"|"video"|"other"
    extension:string
}