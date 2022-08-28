//jshint esversion:6
const express = require("express");

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs")

//jwt is a special key of idenfication of the information that our server only knows
//it can be used to prove that you are who you say you are
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const CallLog = mongoose.model("CallLog");

const router = express.Router();

const nodemailer = require('nodemailer');


//if we waant to test this post route and 
//we typr url then that will be get req not post req
//so we need postman to check this post req


//bodyparser place all info into the req object

router.post("/signup" , async (req , res) =>{

  //from postman we post a requst with json object and get this object below
  const { username, email , password } = req.body;

  try{
      const user = new User({ username,  email , password });

      console.log(user);

      //wait for save operation to be done
      await user.save();
    
      //create jwt of user id and secret key to save the info of identification
      const token = jwt.sign({ userId: user._id } , "My_Secret_Key");
      res.send({ token });

  }catch(err){ 

      return res.status(422).send(err.message);
  }
});


router.post('/signin', async (req , res)=>{

  const {email , password } = req.body;


  if (!email || !password){
      return res.status(422).send({error:"Must Provide Email and Password!"})
  }

  const user = await User.findOne({ email });

  if (!user){
      return res.status(422).send({error:"Invalid Password or Email!!"});
  }


  try{
      await user.comparePassword(password);

      //create jwt of user id and secret key to save the info of identification
      const token = jwt.sign({ userId: user._id } , "My_Secret_Key");

      res.send({token , user});

  }catch(err){
      return res.status(422).send({error:"Invalid Password or Email!"})
  }

});


////For sending email

//refresh token expires in some days so need to refresh it and type id below 
// https://developers.google.com/oauthplayground
//go to this url and update refresh token

router.post('/sendOtgEmail' ,async (req , res)=>{



  const {email, code} = req.body;

  try{

    const user_check = await User.findOne({ email });

    if (user_check){
        return res.status(422).send({error:"Email Already Exist"});
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'fyp.project.service@gmail.com',
        pass: 'Zain1234',
        clientId: '1060384411316-e5iu662hrn833e4gsvccj0v3fqdtnao3.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04vOI6d3mBcISCgYIARAAGAQSNgF-L9IrYo_UFiLAs12IPaCxc8HjOQETaw0siikmPx7ZTjcT9-MkEj6JCx1xJLUv6jqNcbIXpw'
      }
    });

  
    let mailOptions = {
      from: 'fyp.project.service@gmail.com',
      to: email,
      subject: 'Verify Your Email',
      text: 'This is your verification code '+code
    };
  
    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        return res.status(422).send({error:"Something went wrong!!"})
      } else {
        console.log('Email sent')
        res.send(true);
      }
    });


  }catch(err){ 
    return res.status(422).send({error:"Something went wrong"})
  }

  


});


router.post('/checkLogin', async (req , res)=>{

  const { token } = req.body;

  //now verify this token
  jwt.verify(token , "My_Secret_Key" , async (err , payload)=>{

    if(err){
        return res.status(401).send({ error: "You must be logged in." });
    }

    //payload is the info in the token
    //we put user from payload. So, payload contain user Id
    //check authRoute.js
    const {userId} = payload;
    await User.findById(userId , function(err, user){
      if (!err){
        res.send(user)
       
      }else{
        res.send("Error In Finding user!!")
      }
    }).clone().catch(function(err){ res.send('Something went Wrong!')})
  });
});


router.post("/callLog" , async (req , res) =>{

  const { email, username, type, callJoinId, channelName, today } = req.body;

  try{
    if (type === "create"){

      let callId = (Math.floor(Math.random()*90000) + 10000).toString();

      const callLog = new CallLog({ 
        "CallId" : callId,
        "CreatorEmail" : email , 
        "CreatorUsername" : username ,
        "ReceiverEmail" : '' , 
        "ReceiverUsername" : '' ,
        "CallStatus" : 'created' , 
        "ChannelName" : channelName , 
        "CreateDate" : today , 
        "ReceiveDate" : '' 
      });

      await callLog.save();

      res.send(callLog);
  
    }else if(type === "join"){

      const result = await CallLog.findOneAndUpdate(
        {CallId:callJoinId , CallStatus:'created', ChannelName:channelName}, 
        
        {ReceiverEmail:email , ReceiverUsername:username , 
          CallStatus:'joined' , ReceiveDate:today},

        {returnDocument: 'after'}
        );
      
      if (result){
        res.send(result)
      }else{
        res.send(null)
      }
    
    }
  }catch(err){
    return res.status(422).send({error:"Something went wrong!"})
  } 
});


//postman http://localhost:3000/callLog/zain
//req.params.email = zain

router.get("/callLog/:email" , async (req , res) =>{

  const email = req.params.email;
  const user = await CallLog.find({ "$or" : [ { CreatorEmail: email } , { ReceiverEmail: email }]});
  res.send(user)
})



router.post("/changePassword" , async (req , res) =>{

  const {email , password} = req.body;
  let {newPassword} = req.body;

  try{

    const user = await User.findOne({ email });

    if (!user){
      return res.status(422).send({error:"Invalid Password or Email!"});
    }

    await user.comparePassword(password);

    bcrypt.genSalt(10 , (err, salt)=>{
      if(err){
          return next(err);
      }

      //if we successfully generate salt then hash the password and add salt in it
      bcrypt.hash(newPassword, salt , async (err, hash)=>{

      if(err){
          return next(err);
      }

      //now replace the plain text password into hash
      newPassword = hash;

      const result = await User.findOneAndUpdate(
        {email}, 
        {password:newPassword},
        {returnDocument: 'after'}
      );
      res.send(result)
        
      })
    });

  }catch(err){
      return res.status(422).send({error:"Something went Wrong"})
  }

})

router.route("/category")

    .get((req, res) => {
        res.send("Get Category")
    })

    .post((req, res) => {
        const { email , password } = req.body;
        response = "Email="+email+"\nPassword="+password;
        res.send(response)
    })
    
    .delete((req, res) => {
        res.send("Delete Category")
    })

module.exports = router;