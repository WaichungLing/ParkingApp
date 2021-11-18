const mongoose = require('mongoose');
const moment = require('moment');
const Twilio = require('twilio');
const twilio_sid = process.env.TWILIO_SID;
const twilio_token = process.env.TWILIO_AUTHTOKEN;
const twilio_phone_number = process.env.TWILIO_PHONE_NUMBER;

const Schema = mongoose.Schema;

const apt_schema = new Schema({
    join_code: {type: Number, required: true},
    residents: [{ type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    num_lanes: { type: Number, required: true},
    num_spots: { type: Number, required: true},
    spots: {type: mongoose.Mixed, required: true},
    movetimes: {type: Date, required: true}						// for notifcations
});

const testDate = new Date('December 17, 1995 03:24:00');		// some arbitrary time
const testNumber = 15105168560;									// this is my number dont call me
const testName = "Victor";										// switch to Apartment.user.name for each user

apt_schema.statics.sendNotifications = function(callback){
	const nowDate = new Date();
	if (nowDate >= testDate){									// always true for testing rn
		const client = new Twilio(twilio_sid, twilio_token);
		const options = {
            to: `+ ${testNumber}`,
            from: `+ ${twilio_phone_number}`,
            /* eslint-disable max-len */
            body: `Hi ${testName}. Time to move your car!`,
            /* eslint-enable max-len */
        };
        client.messages.create(options, function(err, response) {
            if (err) {
                console.error(err);
            }
            else {
                console.log(`Message sent to ${testName}: ${testNumber}`);
            }
        });

        if (callback){
        	callback.call();
        }
	}
}

const Apt = mongoose.model('Apt', apt_schema);

module.exports = Apt;