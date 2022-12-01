// @ts-check
import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"
import { writeFileSync } from "fs"
import { extname } from "path"
import slugify from "slugify"
/**
* @typedef { import("../src/admin/types/index").UserLoad } UserLoad
* @typedef { import("../src/admin/types/index").RouteLoad } RouteLoad
* @typedef { import("../src/admin/types/index").CategoryLoad } CategoryLoad
* @typedef { import("../src/admin/types/index").TagLoad } TagLoad
* @typedef { import("../src/admin/packages/fileUploader/types").AssetLoad } AssetLoad
*/

/** Default asset */
const defaultAsset = {
    _id: "111d45db1000c382457b0111",
    name: "No image",
    path: "no-image.jpeg",
    type: "image",
    extension: "jpeg"
}

/** Save image url */
async function saveImage(url,imagePathName){
    const urlRequest = await fetch(url)
    const fileBuffer = Buffer.from(await urlRequest.arrayBuffer())
    const imageDiskPath = `${process.cwd()}/assets/images/${imagePathName}`
    writeFileSync(imageDiskPath,fileBuffer)
}

// MongoDB
const mongoClient = new MongoClient("mongodb://localhost:27017/")
await mongoClient.connect()
const database = mongoClient.db("svelteCMS")
const usersCollection = database.collection("__users")
const assetsCollection = database.collection("__assets")
const routesCollection = database.collection("__routes")

/** Generate users and assets */
async function usersAssets() {
    // Dummy json
    const userApiUrl = "https://dummyjson.com/users?limit=100"
    const usersApiResponse = await (await fetch(userApiUrl)).json()
    /** @type {any[]} */
    const apiUsers = usersApiResponse.users
    for(const apiUser of apiUsers){
        /** Check if user exists */
        const userExists = await usersCollection.findOne({ email:apiUser.email})
        // If not exists
        if(!userExists){
            const imagePathName = `${apiUser.firstName+apiUser.lastName}.png`
            const imageApiUrl = `https://robohash.org/${imagePathName}?bgset=bg1`
            await saveImage(imageApiUrl,imagePathName)
            /** @type {AssetLoad} */
            const newAsset = {
                name: `${apiUser.firstName} ${apiUser.lastName}`,
                path: imagePathName,
                type: "image",
                extension: "png"
            }
            const newAssetInserted = await assetsCollection.insertOne(newAsset)
            newAsset['_id'] = newAssetInserted.insertedId.toString()

            /** @type {UserLoad} */
            const newUserData = {
                firstName: apiUser.firstName,
                lastName: apiUser.lastName,
                email: apiUser.email,
                password: await bcrypt.hash("svelteCms",10),
                image: newAsset,
                verified: true,
                role: "user",
            }
            await usersCollection.insertOne(newUserData)
            console.log(`New asset:${newAsset.path}`)
            console.log(`New user:${newUserData.email}`)
            console.log("<-------------------------------->")
            await new Promise(r=>setTimeout(r,1000))
        }
    }
}

/** Generate products route */
async function productRoute(){
    /** Check if route exists */
    const routeExists = await routesCollection.findOne({ ID:"products" })
    // Create route
    if(!routeExists){
        /** @type {RouteLoad} */
        const routeData = {
            ID: "products",
            title: "products",
            includeCategories: "yes",
            includeTags: "yes",
            meta: {
                title: "Web dev products",
                desc: "All the latest web development products."
            },
            elements: [
                { ID:"title", name:"Product title", type:"input", value:"" },
                { ID:"slug", name:"Product slug", type:"slug", value:"" },
                { ID:"description", name:"Product description", type:"textArea", value:"" },
                { ID:"content", name:"Product content", type:"content", value:"" },
                { ID:"brand", name:"Product brand", type:"input", value:"" },
                { ID:"thumbnail", name:"Product thumbnail", type:"image", value:"" },
            ]
        }
        // Insert route
        await routesCollection.insertOne(routeData)
        // Insert route objects
        const apiResponse = await (await fetch("https://dummyjson.com/products")).json()
        /** @type {any[]} */
        const products = apiResponse.products
        for(const product of products){
            const productSlug = slugify(product.title,{strict:true,lower:true})
            const productSlugExists = await database.collection("products").findOne({ slug:productSlug })
            // Skip if product skug exists
            if(productSlugExists) continue
            // Create asset
            const imageApiUrl = product.thumbnail
            const imageExtName = extname(imageApiUrl).replace(".","")
            const imagePathName = `${product.title.replaceAll(" ","-")}-${product.id}.${imageExtName}`
            await saveImage(imageApiUrl,imagePathName)
            /** @type {AssetLoad} */
            const newAsset = {
                name: product.title,
                path: imagePathName,
                type: "image",
                extension: imageExtName
            }
            const newAssetInserted = await assetsCollection.insertOne(newAsset)
            newAsset['_id'] = newAssetInserted.insertedId.toString()
            // Create route object
            const newRouteObject = {
                title:product.title,
                slug:productSlug,
                description:product.description,
                brand:product.brand,
                thumbnail:newAsset,
                content:{
                    "time": 1669398262334,
                    "blocks": [
                      {
                        "id": "0Ya7z4kEz9",
                        "type": "header",
                        "data": {
                          "text": product.title,
                          "level": 2
                        }
                      }
                    ],
                    "version": "2.25.0"
                }
            }
            const insertedObject = await database.collection("products").insertOne(newRouteObject)
            console.log(`New route:products Object:${insertedObject.insertedId}`)
            console.log("<-------------------------------->")
            await new Promise(r=>setTimeout(r,1000))
        }
    }
}

/** Generate posts route */
async function postsRoute(){
    /** Check if route exists */
    const routeExists = await routesCollection.findOne({ ID:"posts" })
    // Create route
    if(!routeExists){
        /** @type {RouteLoad} */
        const routeData = {
            ID: "posts",
            title: "posts",
            includeCategories: "yes",
            includeTags: "yes",
            meta: {
                title: "Web dev posts",
                desc: "All the latest web development posts."
            },
            elements: [
                { ID:"title", name:"post title", type:"input", value:"" },
                { ID:"slug", name:"post slug", type:"slug", value:"" },
                { ID:"description", name:"post description", type:"textArea", value:"" },
                { ID:"content", name:"post content", type:"content", value:"" },
                { ID:"thumbnail", name:"post thumbnail", type:"image", value:"" },
            ]
        }
        // Insert route
        await routesCollection.insertOne(routeData)
        // Insert route objects
        const apiResponse = await (await fetch("https://dummyjson.com/posts")).json()
        /** @type {any[]} */
        const posts = apiResponse.posts
        for(const post of posts){
            const postSlug = slugify(post.title,{strict:true,lower:true})
            const postSlugExists = await database.collection("posts").findOne({ slug:postSlug })
            // Skip if post skug exists
            if(postSlugExists) continue
            // Create route object
            const newRouteObject = {
                title:post.title,
                slug:postSlug,
                description:post.body,
                thumbnail:defaultAsset,
                content:{
                    "time": 1669398262334,
                    "blocks": [
                      {
                        "id": "0Ya7z4kEz9",
                        "type": "header",
                        "data": {
                          "text": post.title,
                          "level": 2
                        }
                      }
                    ],
                    "version": "2.25.0"
                }
            }
            const insertedObject = await database.collection("posts").insertOne(newRouteObject)
            console.log(`New route:posts Object:${insertedObject.insertedId}`)
            console.log("<-------------------------------->")
            await new Promise(r=>setTimeout(r,1000))
        }
    }
}

/** Generate dunny routes */
async function dummyRoutes(){
    /** The number of routes to generate */
    const numberOfRoutes = 50
    /** Loop number, updated inside while loop */
    let loopNumber = 1
    // Loop routes
    while(true){
        const routeID = `dummyRoute${loopNumber}`
        const routeExists = await routesCollection.findOne({ ID:routeID })
        /** @type {RouteLoad} */
        const routeData = {
            ID: routeID,
            title: `DummyRoute #${loopNumber}`,
            includeCategories: "yes",
            includeTags: "yes",
            meta: {
                title: "DummyRoute",
                desc: `Test dummy route number ${loopNumber}.`
            },
            elements: [
                { ID:"title", name:"post title", type:"input", value:"" },
                { ID:"slug", name:"post slug", type:"slug", value:"" },
                { ID:"description", name:"post description", type:"textArea", value:"" },
                { ID:"content", name:"post content", type:"content", value:"" },
                { ID:"thumbnail", name:"post thumbnail", type:"image", value:"" },
            ]
        }
        // Insert route, if route do not exists
        if(!routeExists){
            await routesCollection.insertOne(routeData)
        }
        // Update loop mumber
        loopNumber = loopNumber+1
        // Break while loop
        if(loopNumber===numberOfRoutes) break
    }

}
/** Generate categories */
async function categoriesTags(){
    /** The number of routes to generate */
    const numberOfRoutes = 50
    /** Loop number, updated inside while loop */
    let loopNumber = 1
    // Loop routes
    while(true){
        const categoriesCollection = database.collection("__categories_products")
        const tagsCollection = database.collection("__tags_products")
        const categorySlug = `category-${loopNumber}`
        const categorySlugExists = await categoriesCollection.findOne({ slug:categorySlug })
        const tagSlug = `tag-${loopNumber}`
        const tagSlugExists = await tagsCollection.findOne({ slug:tagSlug })
        // Insert category
        if(!categorySlugExists){
            /** @type {CategoryLoad} */
            const newCategory = {
                name: `Category name ${loopNumber}`,
                slug: categorySlug,
                description: `This is category name number ${loopNumber}.`,
                image: defaultAsset
            }
            await categoriesCollection.insertOne(newCategory)
        }
        // Insert tag
        if(!tagSlugExists){
            /** @type {TagLoad} */
            const newTag = {
                name: `Tag name ${loopNumber}`,
                slug: tagSlug,
                description: `This is tag name number ${loopNumber}.`
            }
            await tagsCollection.insertOne(newTag)
        }
        // Update loop mumber
        loopNumber = loopNumber+1
        // Break while loop
        if(loopNumber===numberOfRoutes) break
    }
}

await usersAssets()
await productRoute()
await categoriesTags()
await postsRoute()
await dummyRoutes()
// Close db connection
await mongoClient.close()