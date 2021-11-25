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





router.route("/apts").get(function (req, res){
	let db_connection = dbo.getDb("ParkingApp");
	// console.log("getting all users");
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
	// console.log(join_code);
	let query = {join_code: join_code};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			if (err){
				res.status(500);
				res.send(err.message);
			}
			// console.log(result);
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
	if (!req.body.join_code || !req.body.num_lanes || !req.body.num_spots){
		res.status(400);
		res.send("Error: apartment needs all fields.\n");
	}

	let residents = []
	residents.push(req.body.phone);
	
	let spots = []
	for (let i = 0; i < req.body.num_lanes; i++) {
		for (let j = 0; j < req.body.num_spots; j++) {
			spots.push({});
		}
	}
	
	/** TODO **/
	// handle move time
	const testDate = new Date('December 17, 1995 03:24:00');
	/** TODO **/

	let newapt = new Apt({
		join_code: req.body.join_code,
		num_lanes: req.body.num_lanes,
		num_spots: req.body.num_spots,
		residents: residents,		// passed as JSON array
		spots: spots,				// passed as JSON array
		move_time: testDate,		// TODO
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

router.route("/apts/update/:joincode").post(function (req, res){
	if (!req.body.join_code || !req.body.num_lanes || !req.body.num_spots || !req.body.residents || !req.body.spots){
		res.status(400);
		res.send("Error: apartment needs all fields.\n");
	}

	let query = { join_code: req.params.joincode};
	let updateuser = {
		$set: {
			join_code: req.body.join_code,
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

router.route("/apts/:id").post(function (req, res){	// update
	if (!req.body.join_code || !req.body.num_lanes || !req.body.num_spots || !req.body.residents || !req.body.spots){
		res.status(400);
		res.send("Error: apartment needs all fields.\n");
	}
	
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let updateuser = {
		$set: {
			join_code: req.body.join_code,
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

router.route("/apts/:id/sendNotifs").get(function (req, res){
	let id = req.params.id;
	let query = { _id: ObjectId(id)};
	let db_connection = dbo.getDb("ParkingApp");
	db_connection
		.collection("Apts")
		.findOne(query, function (err, result){
			const nowDate = new Date();
			console.log(nowDate)
			for (let i = 0; i < result.spots.length; i++) {
				if (result.spots[i]["movetime"] && result.spots[i]["phone"]) {
					let spotDate = new Date(result.spots[i]["movetime"])
					console.log(spotDate)
					console.log(new Date(spotDate.getTime() - 30*60000))
					if (nowDate >= spotDate - 30*60000) {
						console.log("got a need to move time for spot in pos " + i);
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
									console.log(`Message sent to: ${toNumber}`);
								}
							});
					}
				}
			}
			res.json(result);
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
