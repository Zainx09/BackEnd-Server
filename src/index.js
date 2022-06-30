//jshint esversion:6
require('./models/User');
require('./models/CallLog');

const express = require("express");

const config = require("./config/keys");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const allRoutes = require("./routes/allRoutes");

const Pusher = require('pusher');

const pusherConfig = require('./pusher/pusher.json'); // (1)
const pusherClient = new Pusher(pusherConfig);


// mongodb+srv://Zain:<password>@cluster0.c23hs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const app = express()
app.use(express.json())
//we handle all our routes using authroutes 


//it should be first then app.use(authRoutes)
//handle incomming json information
app.use(bodyParser.json());


app.use(allRoutes);






////////////////////// MONGODB ////////////////////////////////////////////

// const mongoUri = 'mongodb+srv://Zain:Zain@cluster0.c23hs.mongodb.net/myMainDB?retryWrites=true&w=majority' 

const mongoUri = config.mongoURI;

mongoose.connect(mongoUri , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 

mongoose.connection.on('connected' , ()=>{
    console.log("MongoDb connected!");
});

mongoose.connection.on('error' , (err)=>{
    console.log("Error : " , err);
    
});

////////////////////// MONGODB ////////////////////////////////////////////



app.get('/', (req, res) => {
    res.send("Server Is Working......")
})

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));


//URL
// https://fyp-express-server.herokuapp.com/