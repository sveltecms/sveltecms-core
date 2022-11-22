import type { CategoryLoad,CategoryData,TagLoad,TagData, RouteData, RouteLoad, ElementData, RouteObjectData, UserLoad, UserData } from "$Types"

/** Data needed to search categories */
export type SearchCategoryLoad = { query:string }
/** Response from search categories */
export type SearchCategoryRes = CategoryData[]

/** Data needed to update category */
export type CreateCategoryLoad = CategoryLoad
/** Response from updating category */
export type CreateCategoryRes = {
    ok:false
    msg:string
} | {
    ok:true
    msg:string
    category:CategoryData
}
/** Data needed to update category */
export type UpdateCategoryLoad = CategoryLoad
/** Response from updating category */
export type UpdateCategoryRes = {
    ok:boolean
    msg:string
}
/** Data needed to delete category */
export type DeleteCategoryLoad = CategoryData
/** Response from deleting category */
export type DeleteCategoryRes = {
    ok:boolean
    msg:string
}

/** Data needed to search tags */
export type SearchTagLoad = { query:string }
/** Response from search tags */
export type SearchTagRes = TagData[]
/** Data needed to update tag */
export type CreateTagLoad = TagLoad
/** Response from updating tag */
export type CreateTagRes = {
    ok:false
    msg:string
} | {
    ok:true
    msg:string
    tag:TagData
}
/** Data needed to update tag */
export type UpdateTagLoad = TagData
/** Response from updating tag */
export type UpdateTagRes = {
    ok:boolean
    msg:string
}
/** Data needed to delete tag */
export type DeleteTagLoad = TagData
/** Response from deleting tag */
export type DeleteTagRes = {
    ok:boolean
    msg:string
}

/** Load data needed to create route */
export type CreateRouteLoad = RouteLoad
/** Response from creating route */
export type CreateRouteRes = {
    ok:boolean
    msg:string
}
/** Load data needed to update route */
export type UpdateRouteLoad = RouteData
/** Response from updating route */
export type UpdateRouteRes = {
    ok:boolean
    msg:string
}
/** Data needed to delete route */
export type DeleteRouteLoad = RouteData
/** Response from deleting route */
export type DeleteRouteRes = {
    ok:boolean
    msg:string
}

/** Load data needed to create route object */
export type CreateRouteObjectLoad = { elements:ElementData[] }
/** Response from creating route object */
export type CreateRouteObjectRes = {
    ok:boolean
    msg:string
}
/** Load data needed to update route object */
export type UpdateRouteObjectLoad = { objectID:any,elements:ElementData[] }
/** Response from updating route object */
export type UpdateRouteObjectRes = {
    ok:boolean
    msg:string
}
/** Data needed to delete route object */
export type DeleteRouteObjectLoad = RouteObjectData
/** Response from deleting route object */
export type DeleteRouteObjectRes = {
    ok:boolean
    msg:string
}

/** Data needed to create user */
export type CreateUserLoad = UserLoad
/** Response from creating new user */
export type CreateUserRes = {
    ok:boolean
    msg:string
}
/** Data needed to update user */
export type UpdateUserLoad = UserData
/** Response from update new user */
export type UpdateUserRes = {
    ok:boolean
    msg:string
}
/** Data needed to delete user */
export type DeleteUserLoad = UserLoad
/** Response from deleting user */
export type DeleteUserRes = {
    ok:boolean
    msg:string
}