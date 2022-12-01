// @ts-check
import { MongoClient } from "mongodb"

export default new class db{
    mongoDB = mongoDB
}

async function mongoDB(){
    let dbName = "svelteCMS"
    let num = 1
    const mongoClient = new MongoClient("mongodb://localhost:27017/")
    await mongoClient.connect()
    const databasesCursor = await mongoClient.db("svelteCMS").admin().listDatabases()
    const svelteCMSDatabase = databasesCursor.databases.find(data=>data.name===dbName)
    // If database exists, pick another name
    if(svelteCMSDatabase){
        while(true){
            const databaseData = databasesCursor.databases.find(data=>data.name===`${dbName}_${num}`)
            if(!databaseData){
                dbName = `${dbName}_${num}`
                break
            }
            num = num+1
        }
    }
    // Run code
    const database = mongoClient.db(dbName)
    const assetsCollection = database.collection("__assets")
    const usersCollection = database.collection("__users")
    return { src:"mongoDB", dbName, mongoClient, database, assetsCollection, usersCollection }
}