export const defaultAsset = {
    _id: "111d45db1000c382457b0111",
    name: "No image",
    path: "no-image.jpeg",
    type: "image",
    extension: "jpeg"
}

/** All information about svelteCMS */
export const config = {
    /** Path to the admin api base url /admin/api */
    apiBasePath:"/admin/api",
    /** Path to the admin api base url /admin/api */
    abp:"/admin/api",
    /** Base path url to view assets */
    viewAssetsPath:"/admin/api/assets",
    /** Base path url to view assets */
    vap:"/admin/api/assets",
    /** Collection name where routes will be created at */
    routesCollectionName:"__routes",
    /** Collection name where routes will be created at */
    rcn:"__routes",
    /** Collection name where users will be created at */
    ucn:"__users",
    /** Collection name for assets */
    assetsCollectionName:"__assets",
    /** Collection name for assets */
    acn:"__assets",
    /** Base for route categories */
    categoriesCollectionBase:"__categories",
    /** Categories collection base */
    ccb:"__categories",
    /** Tags collection base */
    tagsCollectionBase:"__tags",
    /** Tags collection base */
    tcb:"__tags",
    /** Assets per page */
    assetsPerPage:24,
}

