const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oesrn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      console.log('database connected')
      const database = client.db("attendance-managemnet-system");
      const studentsCollection = database.collection("students");
      const teachersCollection = database.collection("teachers");
  
                                // USERS API'S
  
      // post api for students
      app.post('/students', async(req,res)=>{
        const student = req.body;
        student.createdAt = new Date();
        const result = await studentsCollection.insertOne(student)
        res.json(student)
      })

      // get api for students
    app.get('/students',async(req,res)=>{
        const cursor = studentsCollection.find({});
        const students = await cursor.toArray();
        res.send(students)
      })

      // post api for teacher
      app.post('/teachers', async(req,res)=>{
        const teacher = req.body;
        teacher.createdAt = new Date();
        const result = await teachersCollection.insertOne(teacher)
        res.json(teacher)
      })

      // get api for teacher by email
    app.get('/teachers/:email', async(req,res)=>{
      const email = req.params.email;
      const query = {email: email};
      const teacher = await teachersCollection.findOne(query);
      let isTeacher = false;
      if(teacher?.profession === 'teacher'){
        isTeacher=true;
      }
      res.json({teacher: isTeacher})
    })

     // put api for specific student
     app.put('/students/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)}
      const options = {upsert: true}
      let attendance = req.body.attendance;
      if(attendance==='absent') {
       updateDoc = {$set: {attendance: 'present'}}
      }
      else {
      updateDoc = {$set: {attendance: 'absent'}}
      }
      result = await studentsCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })
  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('server is running')
})

app.listen(port, ()=>{
    console.log('server is running on port', 5000)
})

