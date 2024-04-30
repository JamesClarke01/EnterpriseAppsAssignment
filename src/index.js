const {MongoMemoryServer} = require('mongodb-memory-server');
const {MongoClient, ObjectId} = require('mongodb');
const express = require('express');
const fs = require('fs'); //allows file system browsing
const path = require('path'); //for joining paths

const app = express()

const jsonFilePath = "src/data/products.json";
const indexFile = "index.html";
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

//Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//return an array of IDs of all products
app.get("/products", async (req, res) => {    
    
    const search = decodeURIComponent(req.query.search); 
    var result = null;

    if (search != "undefined") {  //If search query is attached
        const searchResults = await dbCollection.find({name:search}).project({_id:1}).toArray();

        if (searchResults.length != 1) {
            res.status(404).send("No results found");
        } else {
            res.send(searchResults[0]);
        }
    } else {
        res.send(await dbCollection.find({}).project({_id:1}).toArray());  
    }   
});

//return a specific product specified by id
app.get("/products/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await dbCollection.findOne({_id: new ObjectId(id)}, {name:1});

        res.send(result);   
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Serve index file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', indexFile));
});

//Adding item
app.post("/products/", (req, res) => {

    dbCollection.insertOne(req.body, (err, result) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        console.log('Inserted documents:', result.insertedCount);
        res.send("Received JSON data");
    });   
});

//Updating item
app.put("/products/", (req, res) => {

    const filter = {_id: new ObjectId(req.body.ID)};
    const update = {$set: req.body};

    dbCollection.updateOne(filter, update, (err, result) => {
        if (err) {
            console.error('Error:', err);
            return;
        }
        console.log('Updated documents:', result.modifiedCount);
        res.send("Received JSON data");
    });
});


app.delete("/products/:id", async (req, res) => {
    dbCollection.deleteOne({_id: new ObjectId(req.params.id)});
});


app.listen(3000, async() => {
    startDatabase();

    console.log("Listening on port 3000");
});

