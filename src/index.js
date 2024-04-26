const {MongoMemoryServer} = require('mongodb-memory-server');
const {MongoClient} = require('mongodb');
const express = require('express');

const app = express()

let database = null

async function startDatabase() {
    const mongo = new MongoMemoryServer();
    const mongoDBURL = await mongo.getConnectionString();
    const connection = await MongoClient.connect(mongoDBURL, {useNewUrlParser: true});
    database = connection.db();
}


app.get('/', async (req, res) => {
    res.send("Hello Get!");
});

app.get('/test', async (req, res) => {
    res.send("Hello test!");
});


app.listen(3000, async() => {
    console.log("Listening on port 3000");
});