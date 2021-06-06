const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
    const adminsCollection = client.db("doctorsPortal").collection("admins"); 
    
   
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
    app.post('/add-admin', (req, res) => {
        const adminData = req.body;
        adminsCollection.insertOne(adminData)
        .then(result => {
            console.log(result);
            if (result.insertedCount> 0) {
                res.send(true)
            }
        })
    })


    app.get('/isAdmin', (req, res) => {
        const email = req.query.email;
        adminsCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })
    app.get('/isDoctor', (req, res) => {
        const email = req.query.email;
        doctorsCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })
    app.get('/isStaff', (req, res) => {
        const email = req.query.email;
        staffsCollection.find({ email: email })
            .toArray((err, staffs) => {
                res.send(staffs.length > 0);
            })
    })

    app.delete('/admin-delete/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        adminCollection.deleteOne({ _id: id })
            .then(result => res.send(result.deletedCount > 0))
    });
    app.delete('/doctor-delete/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        doctorsCollection.deleteOne({ _id: id })
            .then(result => res.send(result.deletedCount > 0))
    });
    app.delete('/staff-delete/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        staffsCollection.deleteOne({ _id: id })
            .then(result => res.send(result.deletedCount > 0))
    });

});


app.listen(3002)