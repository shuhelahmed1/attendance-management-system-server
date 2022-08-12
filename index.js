const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
  app.use(cors(corsConfig))
  app.options("*", cors(corsConfig))
  app.use(express.json())
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization")
    next()
  })

const uri = "mongodb+srv://attendance-managemnet-system:P7xp8wzsJhfSHAlo@cluster0.oesrn.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      console.log('database connected')
      const database = client.db("attendance-managemnet-system");
      const usersCollection = database.collection("users");
  
                                // USERS API'S
  
      // post api for users
      app.post('/users', async(req,res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user)
        res.json(result)
      })

      // get api for users
    app.get('/users',async(req,res)=>{
        const cursor = usersCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders)
      })

  
      // get api for specific user
    //   app.get('/users/:email', async(req,res)=>{
    //     const email = req.params.email;
    //     const query = {email: email};
    //     const user = await usersCollection.findOne(query);
    //     let isAdmin = false;
    //     if(user?.role === 'admin'){
    //       isAdmin=true;
    //     }
    //     res.json({admin: isAdmin})
    //   })
  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('server is running')
})


// pass : Ofpg8aZFFbSPF7C8


app.listen(port, ()=>{
    console.log('server is running on port', 5000)
})

