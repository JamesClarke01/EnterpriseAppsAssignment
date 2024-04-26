const {MongoMemoryServer} = require('mongodb-memory-server');
const {MongoClient, ObjectId} = require('mongodb');
const express = require('express');
const fs = require('fs'); //allows file system browsing

const app = express()

const jsonFilePath = "src/data/productsSmall.json"
const collectionName = "products"

//let db = null
let dbCollection = null

async function startDatabase() {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db()

    const dataJson = fs.readFileSync(jsonFilePath);
    const data = JSON.parse(dataJson);

    dbCollection = db.collection(collectionName);
    await dbCollection.insertMany(data);
}

app.get("/", async (req, res) => {    
    const result = await dbCollection.find({}).toArray()

    res.send(result);
});

app.get("/:id", async (req, res) => {
    const id = req.params.id;

    const result = await dbCollection.findOne({_id: new ObjectId(id)});

    res.send(result);    
});

app.listen(3000, async() => {
    startDatabase();
    console.log("Listening on port 3000");
});