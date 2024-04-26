const {MongoMemoryServer} = require('mongodb-memory-server');
const {MongoClient} = require('mongodb');
const express = require('express');
const fs = require('fs'); //allows file system browsing

const app = express()

const jsonFilePath = "src/data/productsSmall.json"
const collectionName = "products"

let db = null

async function startDatabase() {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db()

    const dataJson = fs.readFileSync(jsonFilePath);
    const data = JSON.parse(dataJson);

    const collection = db.collection(collectionName);
    await collection.insertMany(data);
}

app.get('/', async (req, res) => {    
    res.send(await db.collection(collectionName).find({}).toArray());
});

app.get('/test', async (req, res) => {
    res.send("Hello test!");
});

app.listen(3000, async() => {
    startDatabase();
    console.log("Listening on port 3000");
});