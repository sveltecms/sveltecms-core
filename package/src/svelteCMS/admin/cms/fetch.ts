import svelteCMS from "$svelteCMS"
import type { Collection, Db } from "mongodb"
import type { AssetData } from "$Packages/fileUploader/types"
import type { FetchAssetLoad,FetchAssetsLoad, FetchUserLoad, FetchUsersLoad, FetchRouteLoad, FetchRoutesLoad } from "$Types/cms"
import type { RouteData, UserData } from "$Types"

export default class Fetch {
    private routesCollection:Collection
    private assetsCollection:Collection
    private usersCollection:Collection

    // Fetch constructor
    constructor(private db:Db){
        this.db = db
        this.routesCollection = db.collection(svelteCMS.config.rcn)
        this.assetsCollection = db.collection(svelteCMS.config.acn)
        this.usersCollection = db.collection(svelteCMS.config.ucn)
    }

    /** Find one route */
    async route(props:FetchRouteLoad){
        const routeDbResult:any = this.routesCollection.findOne(props)
        const route:Promise<RouteData|null> = routeDbResult
        return route
    }
    /** Find multiple routes */
    async routes(props:FetchRoutesLoad){
        const routesDbResult:any = this.routesCollection.find(props.filter).limit(props.count).map((data:any)=>{ data['_id']=data['_id'].toString();return data}).toArray()
        const routes:Promise<RouteData|null> = routesDbResult
        return routes
    }

    /** Find one asset */
    async asset(props:FetchAssetLoad){
        const assetDbResult:any = this.assetsCollection.findOne(props)
        const asset:Promise<AssetData|null> = assetDbResult
        return asset
    }
    /** Find multiple assets */
    async assets(props:FetchAssetsLoad){
        const assetsCursor = this.assetsCollection.find(props.filter).limit(props.count)
        // Add skip objects
        if(props.pageNumber){
            const itemsToSkip = props.pageNumber*svelteCMS.config.assetsPerPage - svelteCMS.config.assetsPerPage
            assetsCursor.skip(itemsToSkip)
        }
        const assetsDbResult = assetsCursor.map((data:any)=>{ data['_id']=data['_id'].toString();return data}).toArray()
        const assets:Promise<AssetData[]> = assetsDbResult
        return assets
    }

    /** Find one user */
    async user(props:FetchUserLoad){
        const excludeRoot = { email:{$ne:"root@sveltecms.dev"} }
        const userDbResult:any = this.usersCollection.findOne({...excludeRoot,...props})
        const user:Promise<UserData|null> = userDbResult
        return user
    }
    /** Find multiple users */
    async users(props:FetchUsersLoad){
        const excludeRoot = { email:{$ne:"root@sveltecms.dev"} }
        const usersCursor = this.usersCollection.find({...excludeRoot,...props.filter}).limit(props.count)
        // Add skip objects
        if(props.pageNumber){
            const itemsToSkip = props.pageNumber*svelteCMS.config.usersPerPage - svelteCMS.config.usersPerPage
            usersCursor.skip(itemsToSkip)
        }
        const usersDbResult:any = usersCursor.map((data:any)=>{ data['_id']=data['_id'].toString();return data}).toArray()
        const users:Promise<UserData[]> = usersDbResult
        return users
    }
}