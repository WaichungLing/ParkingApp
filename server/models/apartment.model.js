const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apt_schema = new Schema({
    join_code: {type: Number, required: true},
    residents: [{ type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    num_lanes: { type: Number, required: true},
    num_spots: { type: Number, required: true},
    spots: {type: mongoose.Mixed, required: true},
    movetimes: {type: Date, required: true}					// for notifcations
})

apt_schema.statics.sendNotifications = function(callback){
	const nowDate = new Date();
	console.log("temp hold here test");
}

const Apt = mongoose.model('Apt', apt_schema);

module.exports = Apt;