const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugc3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        //the client is mongodb here. upore j client ache oitake connect korar jonne ekhane wait korbo.database connect hoye gelo.
        await client.connect();
        // console.log('database connected successfully');
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