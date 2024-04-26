const {MongoMemoryServer} = require('mongodb-memory-server');
const {MongoClient, ObjectId} = require('mongodb');
const express = require('express');
const fs = require('fs'); //allows file system browsing

const app = express()

const jsonFilePath = "src/data/productsSmall.json";
const indexPath = "src/index.html";
const collectionName = "products";

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

app.get("/products", async (req, res) => {    
    const result = await dbCollection.find({}).project({_id:1}).toArray();

    res.send(result);
});

app.get("/products/:id", async (req, res) => {
    const id = req.params.id;

    const result = await dbCollection.findOne({_id: new ObjectId(id)}, {name:1});

    res.send(result);    
});

app.get("/", (req, res) => {
    
    fs.readFile(indexPath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.send(htmlContent);  
    });
});

app.listen(3000, async() => {
    startDatabase();

    console.log("Listening on port 3000");
});