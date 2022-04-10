//jshint esversion:6
const express = require("express");

const mongoose = require("mongoose");

//jwt is a special key of idenfication of the information that our server only knows
//it can be used to prove that you are who you say you are
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const CallLog = mongoose.model("CallLog");

const router = express.Router();


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

  const { email, username, type, callJoinId, channelName } = req.body;

  let today = new Date();

  let dd = today.getDate();
  let mm = today.getMonth()+1; 
  let yyyy = today.getFullYear();

  if(dd<10){
    dd='0'+dd;
  } 

  if(mm<10){
      mm='0'+mm;
  } 

  let hr = today.getHours();
  let min = today.getMinutes();

  if (min < 10){
      min = "0" + min;
  }

  var ampm = "am";
  if( hr > 12 ){
      hr -= 12;
      ampm = "pm";
  }

  today = dd+'-'+mm+'-'+yyyy+" "+hr+":"+min+""+ampm;

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

      // const {modifiedCount} = await CallLog.updateOne(
      //   {CallId:callJoinId , CallStatus:'created', ChannelName:channelName}, 
      //   {ReceiverEmail:email , ReceiverUsername:username , CallStatus:'joined' , ReceiveDate:today} 
      //   );
    
      // res.send({modifiedCount});

      const result = await CallLog.findOneAndUpdate(
        {CallId:callJoinId , CallStatus:'created', ChannelName:channelName}, 
        {ReceiverEmail:email , ReceiverUsername:username , CallStatus:'joined' , ReceiveDate:today},
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


router.route("/category/:SubCategory")

  .get((req, res) => {
    res.send("get : "+ req.params.SubCategory)
  })

  .put((req, res) => {
    res.send("Put : "+ req.params.SubCategory)
  })

  .patch((req, res) => {
    res.send("Patch : "+ req.params.SubCategory)
  })

  .delete((req, res) => {
    res.send("Delete : "+ req.params.SubCategory)
  })


  router.route("/category/:SubCategory/:product")

  .get((req, res) => {
    res.send("get : "+ req.params.SubCategory+" "+req.params.product)
  })

  .put((req, res) => {
    res.send("put : "+ req.params.SubCategory+" "+req.params.product)
  })

  .patch((req, res) => {
    res.send("patch : "+ req.params.SubCategory+" "+req.params.product)
  })

  .delete((req, res) => {
    res.send("delete : "+ req.params.SubCategory+" "+req.params.product)
  })





router.route("/viewcart/:userId")

  .get((req, res) => {
    res.send("get viewcart : "+ req.params.userId)
  })

  .put((req, res) => {
    res.send("put viewcart : "+ req.params.userId)
    })

  .patch((req, res) => {
    res.send("patch viewcart : "+ req.params.userId)
    })

  .delete((req, res) => {
    res.send("delete viewcart : "+ req.params.userId)
  })

module.exports = router;