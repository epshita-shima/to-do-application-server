const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://db_todo:214wx4pEoSa35S8i@cluster0.cnsel.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todoList").collection("task");

        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const data = await cursor.toArray()
            res.send(data);
        })
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const completeTask = await taskCollection.findOne(query);
            res.send(completeTask);
        })
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            console.log("addning new info", newTask);
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('To Do server is running');
})

app.listen(port, () => {
    console.log('Todo server running');
})