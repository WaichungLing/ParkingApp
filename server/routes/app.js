const express = require("express");
const router = express.Router();
let User = require("../models/user.model");
let Apt = require("../models/apartment.model");
let Spot = require("../models/spot.model");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const Twilio = require('twilio');		// convert id from String to ObjectID
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
	if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password){
		res.status(400);
		res.send("Error: user needs all fields.\n");
	}
	else {
		let apartments = []
		if (req.body.apartments){
			apartments = req.body.apartments
		}
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
	if (!req.body.name || !req.body.email || !req.body.password || !req.body.phone){
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

router.route("/users/updateApt/:phone").post(function (req, res){	// update
	if (!req.body.apartments){
		res.status(400);
		res.send("Error: No apartments array attached.\n");
	}
	else {
		let phone = req.params.phone;
		let query = { phone: phone};
		let updateuser = {
			$set: {
				apartments: req.body.apartments,
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

router.route("/apts/:join_code").get(function (req, res){
	let join_code = parseInt(req.params.join_code);
	let query = {join_code: join_code};
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
				res.send("Error: apartment not found.\n");
			}
			else {
				res.json(result);
			}
		});
});

router.route("/apts/create").post(function (req, res){
	if (!req.body.join_code || !req.body.num_lanes || !req.body.num_spots || !req.body.phone || !req.body.streetcleaning){
		res.status(400);
		res.send("Error: apartment needs all fields.\n");
	}
	
	let spots = [];
	for (let i = 0; i < req.body.num_lanes; i++) {
		for (let j = 0; j < req.body.num_spots; j++) {
			spots.push({});
		}
	}
	
	let movetimes = [];
	let moveday = parseInt(req.body.streetcleaning.day);
	let movehour = parseInt(req.body.streetcleaning.hour);
	let baseDate = new Date(2021,10,28,0,0);		// Sunday at 0 hours
	const hour_ms = 3600000;
	const day_ms = 86400000;
	const week_ms = 604800000;
	if (moveday != 0){
		for (let i=0;i<100;i++){					// change to however many
			let holdDate = new Date(baseDate.getTime() + (moveday-1)*day_ms + movehour*hour_ms + i*week_ms);
			movetimes.push(holdDate);
		}
	}
	

	let newapt = new Apt({
		join_code: req.body.join_code,
		num_lanes: req.body.num_lanes,
		num_spots: req.body.num_spots,
		spots: spots,				// passed as JSON array
		street_movetime: movetimes
	});
	
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

// I use this API to pass the complete spots array back
router.route("/apts/:joincode").post(function (req, res){
	if (!req.body.spots){
		res.status(400);
		res.send("Error: No spots array attached.\n");
	}

	let query = { join_code: parseInt(req.params.joincode)};
	let updateuser = {
		$set: {
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

router.route("/apts/:id/sendNotifs").get(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			const nowDate = new Date();
			for (let i = 0; i < result.spots.length; i++) {
				if (result.spots[i]["movetime"] && result.spots[i]["phone"]) {
					let spotDate = new Date(result.spots[i]["movetime"])
					if (nowDate >= spotDate - 30*60000) {
						// console.log("got a need to move time for spot in pos " + i);
						let toNumber = result.spots[i]["phone"]
						const client = new Twilio(twilio_sid, twilio_token);
							const options = {
								to: `+ ${toNumber}`,
								from: `+ ${twilio_phone_number}`,
								/* eslint-disable max-len */
								body: `Time to move your car! Make sure it is moved by ${spotDate.getHours()}:${spotDate.getMinutes()}`,
								/* eslint-enable max-len */
							};
							client.messages.create(options, function(err, response) {
								if (err) {
									console.error(err);
								}
								else {
									// console.log(`Message sent to: ${toNumber}`);
								}
							});
					}
				}
			}
			res.json(result);
		});
});

router.route("/apts/:joincode").delete(function (req, res){
	let jc = parseInt(req.params.joincode);
	let query = { join_code: jc};
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

router.route('/api/send-sms').get(function(req, res){
	const client = require('twilio')(twilio_sid, twilio_token);
	const {recipient} = req.query;
	client.messages.create({
		body: "Hi! Looks like your car has blocked others way, please go and check!",
		to: `+${recipient}`,
		from: twilio_phone_number,
	}).then(() => {
		res.send(JSON.stringify({ success: true }));
	})
		.catch(err => {
			console.log(err)
			res.send(JSON.stringify({ success: false }));
		});
});

module.exports = router;
