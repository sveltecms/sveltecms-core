import svelteCMS from "$svelteCMS"
import type { Collection, Db } from "mongodb"
import type { AssetData } from "$Packages/fileUploader/types"
import type {
    FetchAssetLoad,FetchAssetsLoad, FetchUserLoad, FetchUsersLoad, FetchRouteLoad, FetchRoutesLoad,
    FetchRouteObjectLoad, FetchRouteObjectsLoad, FetchRouteObjectsRes,FetchCategoryLoad,FetchCategoriesLoad, FetchTagLoad, FetchTagsLoad
} from "$Types/cms"
import type { CategoryData, RouteData, RouteObjectData, TagData, UserData } from "$Types"

export default class Fetch {
    private routesCollection:Collection
    private assetsCollection:Collection
    private usersCollection:Collection
    private db:Db
    // Fetch constructor
    constructor(db:Db){
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
        const routesCursor = this.routesCollection.find(props.filter).limit(props.count)
        // Add skip objects
        if(props.pageNumber){
            const itemsToSkip = props.pageNumber*svelteCMS.config.routesPerPage - svelteCMS.config.routesPerPage
            routesCursor.skip(itemsToSkip)
        }
        const routesDbResult = routesCursor.map((data:any)=>{ data['_id']=data['_id'].toString();return data}).toArray()
        const routes:Promise<RouteData[]> = routesDbResult
        return routes
    }

    /** Find one route object */
    async routeObject(routeID:any,props:FetchRouteObjectLoad){
        const routeObjectsCollection = this.db.collection(routeID)
        const routeDbResult:any = routeObjectsCollection.findOne(props)
        const route:Promise<RouteObjectData|null> = routeDbResult
        return route
    }
    /** Find one route object */
    async routeObjects(props:FetchRouteObjectsLoad){
        const routeObjectsCollection = this.db.collection(props.routeID)
        const routeObjectsCursor = routeObjectsCollection.find(props.filter).limit(props.count)
        // Add skip objects
        if(props.pageNumber){
            const itemsToSkip = props.pageNumber*svelteCMS.config.routeObjectsPerPage - svelteCMS.config.routeObjectsPerPage
            routeObjectsCursor.skip(itemsToSkip)
        }
        const routeObjectsDbResult = routeObjectsCursor.map((data:any)=>{ data['_id']=data['_id'].toString();return data}).toArray()
        const routes:Promise<FetchRouteObjectsRes[]> = routeObjectsDbResult
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

    /** Find one category */
    async category(props:FetchCategoryLoad){
        const filter = {...props}
        delete filter['routeID']
        const categoryDbResult:any = this.db.collection(`__categories_${props.routeID}`).findOne(filter)
        const category:Promise<CategoryData|null> = categoryDbResult
        return category
    }
    /** Find multiple categories */
    async categories(props:FetchCategoriesLoad){
        const categoriesCursor = this.db.collection(`__categories_${props.routeID}`).find(props.filter).limit(props.count)
        // Add skip objects
        if(props.pageNumber){
            const itemsToSkip = props.pageNumber*svelteCMS.config.categoriesPerPage - svelteCMS.config.categoriesPerPage
            categoriesCursor.skip(itemsToSkip)
        }
        const categoriesDbResult:any = categoriesCursor.map((data:any)=>{ data['_id']=data['_id'].toString();return data}).toArray()
        const categories:Promise<CategoryData[]> = categoriesDbResult
        return categories
    }

    /** Find one tag */
    async tag(props:FetchTagLoad){
        const filter = {...props}
        delete filter['routeID']
        const tagDbResult:any = this.db.collection(`__tags_${props.routeID}`).findOne(filter)
        const tag:Promise<TagData|null> = tagDbResult
        return tag
    }
    /** Find multiple tags */
    async tags(props:FetchTagsLoad){
        const tagsCursor = this.db.collection(`__tags_${props.routeID}`).find(props.filter).limit(props.count)
        // Add skip objects
        if(props.pageNumber){
            const itemsToSkip = props.pageNumber*svelteCMS.config.tagsPerPage - svelteCMS.config.tagsPerPage
            tagsCursor.skip(itemsToSkip)
        }
        const tagsDbResult:any = tagsCursor.map((data:any)=>{ data['_id']=data['_id'].toString();return data}).toArray()
        const tags:Promise<TagData[]> = tagsDbResult
        return tags
    }
}