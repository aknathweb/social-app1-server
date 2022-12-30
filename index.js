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
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const userUpdateDate = req.body;
            console.log(userUpdateDate);
            const option = { upsert: true };
            // set new update data
            const updatedUserOperation = {
                $set: {
                    name: userUpdateDate.name,
                    email: userUpdateDate.email,
                    university: userUpdateDate.university,
                    address: userUpdateDate.address
                }
            }
            const result = await userCollection.updateOne(query, updatedUserOperation, option)
            res.send(result)
        })

        app.post('/post', async (req, res) => {
            // name,email,text,image,postTime
            const post = req.body;
            const postTime = new Date();
            console.log(post);
            const result = await postCollection.insertOne({ ...post, postTime: postTime });
            res.send(result);
        })
        app.get('/post', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        })
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const post = await postCollection.findOne(query);
            res.send(post);
        })

        app.get('/comments', async (req, res) => {
            const query = {};
            const cursor = commentCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        })
        app.post('/post/comment', async (req, res) => {
            //postId,commenterId,name,email,text,commentTime
            const comment = req.body;
            const commentTime = new Date();
            const result = await commentCollection.insertOne({ ...comment, commentTime: commentTime });
            res.send(result);
        })
        app.get('/comments/:postId', async (req, res) => {
            const postId = req.params.postId;
            const query = { postId: postId };
            const cursor = commentCollection.find(query);
            const comments = await cursor.toArray();
            res.send(comments);
        })
        app.put('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            // liker data update
            const commentUpdateDate = req.body;
            console.log(commentUpdateDate);
            const option = { upsert: true };
            // set new update data
            const updatedUserOperation = {
                $set: {
                    likes: [...likes, commentUpdateDate.likerId]
                }
            }
            const result = await commentCollection.updateOne(query, updatedUserOperation, option)
            res.send(result)
        })

    } catch (error) {

    }
}
run().catch(err => console.log(err));