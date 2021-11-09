const express = require("express");
const router = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;		// convert id from String to ObjectID

// may move to separate files later

router.route("/users/:id").get(function (req, res){
	let id = req.params.id;
	let res_string = "User GET request: " + id;
	res.send(res_string);
});

router.route("/users/create").post(function (req, res){
	
});

router.route("/users/:id").post(function (req, res){	// update
	
});

router.route("/users/:id").delete(function (req, res){
	
});


router.route("/apts/:id").get(function (req, res){

});

router.route("/apts/create").post(function (req, res){
	
});

router.route("/apts/:id").post(function (req, res){	// update
	
});

router.route("/apts/:id").delete(function (req, res){
	
});

module.exports = router;