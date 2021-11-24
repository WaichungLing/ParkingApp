const express = require("express");
const router = express.Router();
let User = require("../models/user.model");
let Apt = require("../models/apartment.model");
let Spot = require("../models/spot.model");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;			// convert id from String to ObjectID
const twilio_sid = process.env.TWILIO_SID;
const twilio_token = process.env.TWILIO_AUTHTOKEN;
const twilio_phone_number = process.env.TWILIO_PHONE_NUMBER;

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

	if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password){
		res.status(400);
		res.send("Error: user needs all fields.\n");
	}
	else {
		let apartments = []
		if (req.body.apartments){
			apartments = req.body.apartments
		}
		//console.log(apartments)
		const newuser = new User({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			apartments: apartments,
			password: req.body.password
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

router.route("/users/update/:phone").post(function (req, res){	// update
	if (!req.body.name || !req.body.email || !req.body.password){
		res.status(400);
		res.send("Error: updated user needs name, email, and phone number.\n");
	}
	else {
		let phone = req.params.phone;
		let query = { phone: phone};
		let updateuser = {
			$set: {
				name: req.body.name,
				email: req.body.email,
				phone: phone,
				password: req.body.password,
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

router.route("/users/:phone").delete(function (req, res){
	let phone = req.params.phone;
	let query = { phone: phone};
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
	console.log("getting all users");
	db_connection
		.collection("Apts")
		.find({}).toArray(function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			res.json(result);
		});
});

router.route("/apts/:join_code").get(function (req, res){
	let join_code = parseInt(req.params.join_code);
	console.log(join_code);
	let query = {join_code: join_code};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			console.log(result);
			res.json(result);
		});
});

router.route("/apts/create").post(function (req, res){
	// console.log(req.body.join_code);
	// console.log(req.body.num_lanes);
	// console.log(req.body.num_spots);
	// console.log(req.body.residents);

	var residents = []
	for (let i = 0; i < req.body.residents.length; i++) {
		// console.log(req.body.residents[i]);
		residents.push(ObjectId(req.body.residents[i]))
	}
	var spots = []
	for (let i = 0; i < req.body.num_lanes; i++) {
		for (let j = 0; j < req.body.num_spots; j++) {
			spots.push([]);
		}
	}

	let newapt = new Apt({
		join_code: req.body.join_code,
		num_lanes: req.body.num_lanes,
		num_spots: req.body.num_spots,
		residents: residents,		// passed as JSON array
		spots: spots,				// passed as JSON array
	});
	
	// res.json(newapt);
	
	let db_connection = dbo.getDb("ParkingApp");		// might move this to separate function to share one instance
	db_connection
		.collection("Apts")
		.insertOne(newapt, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
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
			if (err){
				res.status(500);
				res.send(err.message);
			}
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
			let user_array = [];
			let id_array = [];
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

router.route("/apts/:aptid/:spotid/updateSpot").post(function (req, res){
	console.log(req.params);
	let id = req.params.aptid;
	let s_id = req.params.spotid;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			let spots = result.spots;
			let the_spot;
			for (let i = 0; i < spots.length; i++) {
				for (let j = 0; j < spots[i].length; j++) {
					console.log(spots[i][j]._id.toString());
					if (spots[i][j]._id.toString() == s_id) {
						the_spot = spots[i][j];
					}
				}
			}
			res.json(the_spot);
		});
});


router.route("/apts/:id").delete(function (req, res){
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

router.route('/api/send-sms').get(function(req, res){
	const client = require('twilio')(twilio_sid, twilio_token);
	const {recipient} = req.query;
	client.messages.create({
		body: "Hi! Looks like your car has blocked others way, please go and check!",
		to: recipient,
		from: twilio_phone_number,
	}).then(() => {
		res.send(JSON.stringify({ success: true }));
	})
		.catch(err => {
			console.log(err);
			res.send(JSON.stringify({ success: false }));
		});
});

module.exports = router;
