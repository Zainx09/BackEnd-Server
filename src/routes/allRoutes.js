//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");


const router = express.Router();


//if we waant to test this post route and 
//we typr url then that will be get req not post req
//so we need postman to check this post req


router.route("/category")
    .get((req, res) => {
        res.send("Get Category")
    })
    .post((req, res) => {
        res.send("Post Category")
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