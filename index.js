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
        const ordersCollections = client.db("camFinder").collection("orders");
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
        //api for add product
        app.post('/products', async (req, res) => {
            const data = req.body;
            const result = cameraCollections.insertOne(data);
            res.send(result);
        })
        //api for categorised data
        app.get('/category/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { categoryId: id }
            const data = await cameraCollections.find(query).toArray();
            res.send(data)
        })
        //api for storing orders
        app.post('/orders', async (req, res) => {
            const data = req.body;
            const result = await ordersCollections.insertOne(data);
            res.send(result)
        })
        //api for all users
        app.get('/user', async (req, res) => {
            const query = {};
            const data = await usersCollections.find(query).toArray();
            res.send(data);
        })
        //api for get sellers
        app.get('/user/all-sellers', async (req, res) => {
            const query = { seller: true };
            const data = await usersCollections.find(query).toArray();
            res.send(data);
        })
        //api for delete a seller
        app.delete('/user/all-sellers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await usersCollections.deleteOne(query);
            res.send(result);
        })
        //api for get buyers
        app.get('/user/all-buyers', async (req, res) => {
            const query = { seller: false, admin: false };
            const data = await usersCollections.find(query).toArray();
            res.send(data);
        })
        //api for delete a seller
        app.delete('/user/all-buyers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await usersCollections.deleteOne(query);
            res.send(result);
        })
        //api for add user
        app.post('/user', async (req, res) => {
            const data = req.body;
            const result = await usersCollections.insertOne(data);
            res.send(result)
        })
        //api for isAdmin?
        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const data = await usersCollections.findOne(query);
            res.send({ isAdmin: data?.admin === true })
        })
        //api for seller
        app.get('/user/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const data = await usersCollections.findOne(query);
            res.send({ isSeller: data?.seller === true })
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