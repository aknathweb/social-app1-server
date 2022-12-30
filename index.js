const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const { query } = require('express');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Test Running');
});

app.listen(port, () => {
    console.log(`Listening port ${port}`);
});

const uri = "mongodb+srv://anikkumarnath:anikkumarnath@cluster0.7wt8nwb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('MirrorChat').collection('Users');
        const postCollection = client.db('MirrorChat').collection('Posts');
        const commentCollection = client.db('MirrorChat').collection('Comments');
        app.post('/user', async (req, res) => {
            // name,email,photo,university,address
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        app.get('/user', async (req, res) => {
            const searchEmail = req.query.email;
            console.log(searchEmail)
            const query = { email: searchEmail };
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })



    } catch (error) {

    }
}
run().catch(err => console.log(err));