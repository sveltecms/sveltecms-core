// import type { AssetData } from "$Packages/fileUploader/types"
// import type { UserLoad } from "$Types"
// bcrypt.hashSync("sveltecms",10)
const assetDefault = {
    _id: "111d45db1000c382457b0111",
    name: "No image",
    path: "no-image.jpeg",
    type: "image",
    extension: "jpeg"
}

export const defaultAsset = {
    _id: "111d45db1000c382457b0111",
    name: "No image",
    path: "no-image.jpeg",
    type: "image",
    extension: "jpeg"
}

export const defaultUser = {
    firstName: "cms",
    lastName: "root",
    email: "root@sveltecms.dev",
    password: "",
    image: {...defaultAsset,_id:defaultAsset['_id'].toString()},
    verified: false,
    role: "root"
}

/** All information about svelteCMS */
export default {
    name: 'SvelteCMS',
    title: 'All in one cms',
    desc: 'A simple svelte kit cms for all your needs.',
    domain: 'http://localhost:5173',
    domainUrl:"https://sveltecms.dev/",
    logo: '/admin/logo.png',
    favicon: '/admin/favicon.png',
    backdrop: '/admin/backdrop.png',
    keywords: [ 'stock', 'market' ],
    socialMedias: { twitter: 'sveltejs' },
    config:{
        /** Path to the admin api base url /admin/api */
        apiBasePath:"/admin/api",
        /** Api base path to view assets */
        viewAssetsPath:"/admin/api/assets",
        /** Collection name for routes */
        routesCollectionName:"__routes",
        /** Collection name for assets */
        assetsCollectionName:"__assets",
        /** Base for route categories */
        categoriesCollectionBase:"__categories",
        /** Assets per page */
        assetsPerPage:24,
        /** Users per page */
        usersPerPage:16,
        /** Routes per page */
        routesPerPage:16,
        /** Assets per page */
        routeObjectsPerPage:16,
        /** Tags per page */
        tagsPerPage:8,
        /** Categories per page */
        categoriesPerPage:8,
        /** Path to the admin api base url /admin/api */
        abp:"/admin/api",
        /** Base path url to view assets */
        vap:"/admin/api/assets",
        /** Collection name where routes will be created at */
        rcn:"__routes",
        /** Collection name for this project data and config */
        pcn:"__project",
        /** Collection name where users will be created at */
        ucn:"__users",
        /** Collection name for assets */
        acn:"__assets",
        /** Categories collection base */
        ccb:"__categories",
        /** Tags collection base */
        tagsCollectionBase:"__tags",
        /** Tags collection base */
        tcb:"__tags",
    },
    collections:{
        /** Assets linked to element,categories and other */
        assets:"__assets",
        users:"__users",
        routes:"__routes",
        linkedAssets:"__linked_assets",
        assetsLinked:"__assets_linked",
        baseCategories:"__categories",
        baseTags:"__tags",
    },
    diskPaths:{
        /** Disk path where assets will be storage */
        assets: ".svelteCMS/assets",
    },
    paths:{
        /** Disk path where assets will be storage */
        assets: ".svelteCMS/assets",
    },
    viewPaths:{
        /** Disk path where assets will be storage */
        assets: "/admin/api/assets",
    },
    defaults:{
        // Default image when no image available
        asset:assetDefault
    }
}

