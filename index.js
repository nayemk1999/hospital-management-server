const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
const {DB_USER, DB_PASS, DB_NAME} = process.env

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.xzc94.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
client.connect(err => {
    const adminCollection = client.db("doctorsPortal").collection("admin");
    const doctorsCollection = client.db("doctorsPortal").collection("doctors"); 
    const staffsCollection = client.db("doctorsPortal").collection("staffs"); 
    const patientsCollection = client.db("doctorsPortal").collection("patients"); 
    
   
    app.get('/all-patients', (req, res)=>{
        patientsCollection.find({})
        .toArray((error, document)=>{
            res.send(document)
        })
    })
    app.get('/all-doctors', (req, res)=>{
        doctorsCollection.find({})
        .toArray((error, document)=>{
            res.send(document)
        })
    })
    app.get('/all-staffs', (req, res)=>{
        staffsCollection.find({})
        .toArray((error, document)=>{
            res.send(document)
        })
    })
    app.get('/all-admins', (req, res)=>{
        adminCollection.find({})
        .toArray((error, document)=>{
            res.send(document)
        })
    })

    app.post('/register-patient', (req, res) => {
        const patientData = req.body;
        patientsCollection.insertOne(patientData)
        .then(result => {
            if(result.insertedCount > 0){
                res.send(true)
            }
        })
    })
    app.post('/add-doctors', (req, res) => {
        const doctorsData = req.body;
        doctorsCollection.insertOne(doctorsData)
        .then(result => {
            console.log(result);
            if (result.insertedCount> 0) {
                res.send(true)
            }
        })
    })
    app.post('/add-staff', (req, res) => {
        const staffData = req.body;
        staffsCollection.insertOne(staffData)
        .then(result => {
            console.log(result);
            if (result.insertedCount> 0) {
                res.send(true)
            }
        })
    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        doctorCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })
    app.post('/isDoctor', (req, res) => {
        const email = req.body.email;
        doctorCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })
    app.post('/isStaff', (req, res) => {
        const email = req.body.email;
        doctorCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })
});


app.listen(3002)