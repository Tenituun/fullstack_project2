import express from "express";
import { MongoClient } from "mongodb";
import 'dotenv/config';
import dbConnect, { returnAll, returnOne } from "./connect.mjs";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const { Schema } = mongoose;
//Mandatory importing and settings here 
app.use(express.static('public', {root: '.' }));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Setting up mongoose and creating a schema for the albums

mongoose.set('debug', true);
mongoose.set('debug', { color: false });

const albumSchema = new Schema({
    artist: String,
    album: String,
    year: Number,
    country_of_origin : String
}, { collection: 'user' });

const Album = mongoose.model('Album', albumSchema);

//Setting up connection to MongoDB

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

//Index page

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile('./public/index.html', {root: '.' });
});

//Getall page

app.get('/getall.html', (req, res) => {
    let result = dbConnect(client, returnOne, "jazz", "4");
    res.sendFile('./public/getall.html', {root: '.' });
});

//Getall page post

app.post('/getall.html', (req, res) => {    
    getData(returnAll, req.body).then(result => {
        res.send(result);
        console.log("Response sent");
    });
});

//Getone page

app.get('/getone.html', (req, res) => {
    res.sendFile('./public/getone.html', {root: '.' });
});

//Getone page post

app.post('/getone.html', (req, res) => {
    getData(returnOne, req.body.collection, req.body.id).then(result => {
        res.send(result);
        console.log("Response coming from " + req.body.collection + " with the id: " + req.body.id);
    })
});

//Addone page

app.get('/addone.html', (req, res) => {
    res.sendFile('./public/addone.html', {root: '.' });
});

//Addone page post

app.post('/addone.html', (req, res) => {
    let userAlbum = new Album();
    userAlbum.artist = req.body.artist;
    userAlbum.album = req.body.album;
    userAlbum.year = req.body.year;
    userAlbum.country_of_origin = req.body.country;
    let added = add(userAlbum).then(function(res) {
        console.log("File added");
    });
    //Function to add the created mongoose model to the database
    async function add(data) {
        mongoose.connect(process.env.MONGODB_URI_albums);
        await data.save();
        let sendData = JSON.stringify(data);
        res.send(sendData);
    }
});

//update page

app.get('/update.html', (req, res) => {
    res.sendFile('./public/update.html', {root: '.' });
});

//update page post

app.post('/update.html', (req, res) => {
    if (req.get('Content-Type') === "text/plain") {
        getData(returnAll, req.body).then(result => {
            res.send(JSON.stringify(result));
            console.log("All the data was sent");
        });
    } else if (req.get('Content-Type') === "application/json") {
        console.log("JSON detected: Moving on to update function.");
        let updated = update(req.body).then(function (result) {
            res.send(result);
        });

        //Function to update all the fields of the document given

        async function update(data) {
            mongoose.connect(process.env.MONGODB_URI_albums);
            let updated = await Album.findOneAndUpdate( { _id: data._id }, { artist: data.artist, album: data.album, year: data.year, country_of_origin: data.country}, {new: true});
            if(updated) {
                console.log("Document updated")
            } else {
                console.log("No document found");
            }
            return updated;
        }
    } else {
        console.log("What are you even posting?")
    }
});

//delete page

app.get('/delete.html', (req, res) => {
    res.sendFile('./public/delete.html', {root: '.' });
});

//delete page post

app.post('/delete.html', (req, res) => {
    if (req.get('Content-Type') === "text/plain") {   
            getData(returnAll, req.body).then(result => {
            res.send(JSON.stringify(result));
            console.log("All the data sent succesfully");
        });
    } else if (req.get('Content-Type') === "application/json") {
        console.log("Moving on to delete the file with the id: " + req.body._id);

        let deleted = deleteOne(req.body).then(function (res) {
            console.log(res);
        });

        //Function to delete the given document

        async function deleteOne(data) {
            mongoose.connect(process.env.MONGODB_URI_albums);
            let deleted = await Album.findOneAndDelete( { _id: data._id } );
            console.log("File deleted");
            return deleted;
        }
        let resData = deleted;
        res.send(resData);
    } else {
        console.log("What are you even posting?")
    }
});

//Function for retrieving data from the given database in mongoDB

async function getData(query, collection, id_or_model) {
    let data = await dbConnect(client, query, collection, id_or_model);
    console.log("Data fetched from: " + collection);
    return data;
}

//Just a heads up on the port

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
