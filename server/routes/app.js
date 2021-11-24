const express = require("express");
const router = express.Router();
let User = require("../models/user.model");
let Apt = require("../models/apartment.model");
let Spot = require("../models/spot.model");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;			// convert id from String to ObjectID

// may move to separate files later

router.route("/users").get(function (req, res){
	let db_connection = dbo.getDb("ParkingApp");
	// console.log("getting all users");
	db_connection
		.collection("Users")
		.find({}).toArray(function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			res.json(result);
		});
});

router.route("/users/:id").get(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.findOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			if (result == null){
				res.status(404);
				res.send("Error: user does not exist.\n")
			}
			else
				res.json(result);
		});
});

router.route("/users/phone/:phone").get(function (req, res){
	let phone = req.params.phone;
	let query = { phone: phone};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.findOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			if (result == null){
				res.status(404);
				res.send("Error: user does not exist.\n")
			}
			else
				res.json(result);
		});
});

router.route("/users/verify/:phone/:password").get(function (req, res){
	let phone = req.params.phone;
	let pw = req.params.password;
	let query = { phone: phone, password: pw};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.findOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			if (result == null){
				res.status(404);
				res.send("Error: user does not exist.\n")
			}
			else
				res.json(result);
		});
});

router.route("/users/create").post(function (req, res){
	// console.log("Name: " + req.body.name);
	// console.log("Email: " + req.body.email);
	// console.log("Phone #: " + req.body.phone);

	if (!req.body.name || !req.body.email || !req.body.phone || !req.body.apartments || !req.body.password){
		res.status(400);
		res.send("Error: user needs name, email, password and phone number.\n");
	}

	
	else {
		const newuser = new User({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			password: req.body.password,
			apartments: req.body.apartments
		});
		let db_connection = dbo.getDb("ParkingApp");		// might move this to separate function to share one instance
		db_connection
			.collection("Users")
			.insertOne(newuser, function (err, result){
				// if (err) throw err;
				if (err){
					res.status(500);
					res.send(err.message);
				}
				res.status(201);		// created
				res.json(result);
			});
	}
});

router.route("/users/:id").post(function (req, res){	// update
	if (!req.body.name || !req.body.email || !req.body.phone){
		res.status(400);
		res.send("Error: updated user needs name, email, and phone number.\n");
	}
	else {
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
				if (err){
					res.status(500);
					res.send(err.message);
				}
				res.json(result);
			});
	}
});

router.route("/users/:id").delete(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Users")
		.deleteOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			res.json(result);
		});
});



router.route("/apts").get(function (req, res){
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.find({}).toArray(function (err, result){
			if (err) throw err;
			res.json(result);
		});
});

router.route("/apts/:id").get(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			if (result == null){
				res.status(404);
				res.send("Error: Apartment does not exist.\n")
			}
			else
				res.json(result);
		});
});

router.route("/apts/create").post(function (req, res){
	var residents = []
	for (let i = 0; i < req.body.residents.length; i++) {
		residents.push(ObjectId(req.body.residents[i]))
	}
	var spots = []
	for (let i = 0; i < req.body.num_lanes; i++) {
		for (let j = 0; j < req.body.num_spots; j++) {
			spots.push({});
		}
	}
	let newapt = new Apt({
		join_code: req.body.join_code,
		num_lanes: req.body.num_lanes,
		num_spots: req.body.num_spots,
		residents: residents,		// passed as JSON array
		spots: spots,				// passed as JSON array
	});
	
	newapt.spots = spots;
	let db_connection = dbo.getDb("ParkingApp");		// might move this to separate function to share one instance
	db_connection
		.collection("Apts")
		.insertOne(newapt, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			res.status(201);		// created
			res.json(result);
		});

	
});

router.route("/apts/:id/getUsers").get(function (req, res){
	console.log("getting all users in apt");
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			user_array = [];
			id_array = [];
			console.log(result);
			for (let i = 0; i < result.residents.length; i++) {
				console.log(result.residents[i]);
				id_array.push(result.residents[i]);
			}
			db_connection.collection("Users")
				.find({_id: {$in : id_array}}).toArray(function (errr, post){
					console.log(post);
					res.json(post);
				});
			
		});
});

router.route("/apts/:id/getSpots").get(function (req, res){
	console.log("getting all spots in apt");
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			console.log(result.spots);
			res.json(result.spots);
		});
});



router.route("/apts/:aptid/updateSpots").post(function (req, res){
	let id = req.params.aptid;
	let query = { _id: ObjectId(id)};
	let times_arr = req.body.times_arr;
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			let iter = 0;
			for (let i = 0; i < result.num_lanes; i++) {
				for (let j = 0; j < result.num_spots; j++) {
					if (times_arr[iter]["movetime"]) {
						for (let k = 0; k <= j; k++) {
							times_arr[iter - k]["movetime"] = times_arr[iter]["movetime"]
						}
					}
					iter++
				}
			}
			db_connection
			.collection("Apts")
			.updateOne(query, { $set: { spots : times_arr } }, function (errr, resu) {
				if (errr) throw errr;
				res.json(resu);
			});
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
			if (err){
				res.status(500);
				res.send(err.message);
			}
			res.json(result);
		});
});

router.route("/apts/:id").delete(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.deleteOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			res.json(result);
		});
});

module.exports = router;