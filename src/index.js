//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const allRoutes = require("./routes/allRoutes");


const app = express();

//it should be first then app.use(authRoutes)
//handle incomming json information
app.use(bodyParser.json());

//we handle all our routes using authroutes 
app.use(allRoutes);


// use the express-static middleware
app.use(express.static("public"))


app.get("/" , (req , res)=>{
    res.send("Home Page")
})


app.listen(process.env.PORT || 3000 , ()=>{
    console.log("Server Running!!!!!!");
});