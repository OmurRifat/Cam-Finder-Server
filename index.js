const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const { ObjectID } = require('bson');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

//user: camFinderManager
//pass: zLTDhffu5CVYS4Sa

app.use(cors());
app.use(express.json());


const uri = process.env.REACT_APP_url;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)
const run = async () => {
    try {
        const cameraCollections = client.db("camFinder").collection("cameras");
        const usersCollections = client.db("camFinder").collection("users");
        //api for home page data
        app.get('/home-cameras', async (req, res) => {
            const query = {};
            const data = (await cameraCollections.find(query).toArray()).splice(0, 3);
            res.send(data)
        })
        //api for all data in product page
        app.get('/products', async (req, res) => {
            const query = {};
            const data = await cameraCollections.find(query).toArray();
            res.send(data);
        })
        //api for categorised data
        app.get('/category/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { categoryId: id }
            const data = await cameraCollections.find(query).toArray();
            res.send(data)
        })
        //api for all users
        app.get('/user', async (req, res) => {
            const query = {};
            const data = await usersCollections.find(query).toArray();
            res.send(data);
        })
        app.post('/user', async (req, res) => {
            const data = req.body;
            const result = await usersCollections.insertOne(data);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(err => console.log(err.message));



app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(port, () => {
    console.log("Listening from PORT: ", port)
})