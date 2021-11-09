const express = require("express");
const router = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;			// convert id from String to ObjectID

// may move to separate files later

router.route("/users/:id").get(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};					// might have to update if we are using own ids
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.findOne(query, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

router.route("/users/create").post(function (req, res){
	let newuser = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
	};
	let db_connection = dbo.getDb("ParkingApp");		// might move this to separate function to share one instance
	db_connection
		.collection("Users")
		.insertOne(newuser, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

router.route("/users/:id").post(function (req, res){	// update
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let updateuser = {
		$set: {
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
		},
	};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.updateOne(query, updateuser, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

router.route("/users/:id").delete(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.deleteOne(query, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});


router.route("/apts/:id").get(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};					// might have to update if we are using own ids
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

router.route("/apts/create").post(function (req, res){
	let newuser = {
		apt_id: req.body.apt_id,
		num_lanes: req.body.num_lanes,
		num_spots: req.body.num_spots,
		residents: req.body.residents,		// passed as JSON array
		spots: req.body.spots,				// passed as JSON array
	};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.insertOne(newuser, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

router.route("/apts/:id").post(function (req, res){	// update
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let updateuser = {
		$set: {
			apt_id: req.body.apt_id,
			num_lanes: req.body.num_lanes,
			num_spots: req.body.num_spots,
			residents: req.body.residents,		// passed as JSON array
			spots: req.body.spots,				// passed as JSON array
		},
	};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.updateOne(query, updateuser, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

router.route("/apts/:id").delete(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.deleteOne(query, function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

module.exports = router;