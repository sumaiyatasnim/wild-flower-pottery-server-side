const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugc3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        //the client is mongodb here. upore j client ache oitake connect korar jonne ekhane wait korbo.database connect hoye gelo.
        await client.connect();
        // console.log('database connected successfully');
        const database = client.db('wildFlowerPottery');
        const productCollection = database.collection('products');
        const myOrderCollection = database.collection('myOrder');
        const reviewCollection = database.collection('review');
        const usersCollection = database.collection('users');

        // find operation
        // get all products api. express er get lagbe.
        app.get('/allProducts', async (req, res) => {
            //product ta find korbo
            const cursor = productCollection.find({});
            //await korbo karon cursor ta te ja ja pawa geche shob array te convert korbo.shob gula array k diye dbe
            const products = await cursor.toArray();
            res.send(products);
        });
        //get single service
        app.get('/allProducts/:id', async (req, res) => {
            //req object er moddhe params er moddhe id ta pawa jay
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log('id', id);
            const product = await productCollection.findOne(query);
            res.json(product);
        });
        //My Orders Post API
        app.post('/myOrders', async (req, res) => {
            const myOrder = req.body;
            const result = await myOrderCollection.insertOne(myOrder);
            res.json(result);
            console.log(result);
        })

        //My order get api
        app.get("/myOrder/:email", async (req, res) => {
            const result = await myOrderCollection
                .find({
                    email: req.params.email
                })
                .toArray();
            res.send(result);
        });
        /// delete order
        app.delete("/delteOrder/:id", async (req, res) => {
            const result = await myOrderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
        // delete product
        // app.delete("/delteOrder/:id", async (req, res) => {
        //     const result = await productCollection.deleteOne({
        //         _id: ObjectId(req.params.id),
        //     });
        //     res.send(result);
        // });
        app.delete("/allProducts/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        });

        //Post api
        app.post('/addProducts', async (req, res) => {
            //jei request ta pathano hocche shei product ta pabo req.body theke.
            const products = req.body;
            // console.log('hit the post api', products);
            const result = await productCollection.insertOne(products);
            console.log(result);
            res.json(result)
        });

        //user info post . users er kache post kora mane new ekta collection users e add hbe
        app.post("/addUser", async (req, res) => {
            const user = req.body;
            console.log("req.body");
            const result = await usersCollection.insertOne(user);
            res.json(result);
            console.log(result);
        });

        app.put('/addUser', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            //user ache ki nei email diye check korbo 
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })



        //userInfo upsert
        // app.put('/users', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user };
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result);
        //     console.log("PUT", user);

        // })



    }
    finally {
        //jokhon shob kaj hoye jabe tokhon she close korar cheshta korbe
        // await client.close();
    }
}
//async function na hole catch korte partamna.
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Wild Flower Pottery')
})

app.listen(port, () => {
    console.log(`Listening at ${port}`)
})