var Express = require('express');
var MongoClient = require("mongodb").MongoClient;
var cors = require('cors');
require("dotenv").config();

var app = Express();
app.use(cors());
app.use(Express.json());

const databaseConnectionString = process.env.DB_CONNECTION_STRING
const databaseName = process.env.DB_NAME
const port = process.env.PORT || 5050;

var database;

app.listen(port, () => {
    MongoClient.connect(databaseConnectionString,(error,client) =>{
        try {
            database=client.db(databaseName);
            console.log("Database connected");
        } catch(ex)
        {
            console.error("Error connecting to database", ex);
        }

    });

    console.log(`Server is running on port ${port}`);
});

app.get('/api/stickersapp/health', (request, response) => {
    response.json("healthy");
})

app.get('/api/stickersapp/stickers', (request, response) => {
    database.collection("stickersappcollection").find({}).toArray((error, result) =>{
        response.send(result);
    })
})

app.post('/api/stickersapp/stickers', (request, response) => {
    database.collection("stickersappcollection").count({}, function(error, numOfDocs) {

        database.collection("stickersappcollection").insertOne({
            id: (numOfDocs+1).toString(),
            name: request.body.name,
            country: request.body.country,
            userName: request.body.userName
        });
        response.json("Added successfully");
    })
})

app.delete('/api/stickersapp/stickers', (request, response)=> {
    database.collection("stickersappcollection").deleteOne({
        id: request.query.id
    });
    response.json("Deleted successfully");
})