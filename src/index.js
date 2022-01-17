//jshint esversion:6
require('./models/User');

const express = require("express");
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

const mongoUri = 'mongodb+srv://Zain:Zain@cluster0.c23hs.mongodb.net/myMainDB?retryWrites=true&w=majority'

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



//////////////////FOR PUSHER////////////////////////////
app.put('/users/:name', function(req, res) { // (3)
    console.log('User joined: ' + req.params.name);
    pusherClient.trigger('chat_channel', 'join', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.delete('/users/:name', function(req, res) { // (4)
    console.log('User left: ' + req.params.name);
    pusherClient.trigger('chat_channel', 'part', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.post('/users/:name/messages', function(req, res) { // (5)
    console.log('User ' + req.params.name + ' sent message: ' + req.body.message);
    pusherClient.trigger('chat_channel', 'message', {
        name: req.params.name,
        message: req.body.message
    });
    res.sendStatus(204);
});

//////////////////FOR PUSHER////////////////////////////


app.get('/', (req, res) => {
    res.send("Server Is Working......")
})

app.listen(3000, () => {
    console.log("Server is Running on port 3000")
})