const mongoose = require('mongoose');
const moment = require('moment');
const Twilio = require('twilio');
const twilio_sid = process.env.TWILIO_SID;
const twilio_token = process.env.TWILIO_AUTHTOKEN;
const twilio_phone_number = process.env.TWILIO_PHONE_NUMBER;
/*const twilio_sid = "ACeaac78e0d7959ea014354d2bd33e9ddc";
const twilio_token = "061f6fe58b8f158038e84e84613ebf60";
const twilio_phone_number = 18506085395;*/

const Schema = mongoose.Schema;

const apt_schema = new Schema({
    join_code: {type: Number, required: true},
    // residents: [{ type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    residents: [{ type: String, required: true}],
    num_lanes: { type: Number, required: true},
    num_spots: { type: Number, required: true},
    spots: {type: mongoose.Mixed, required: true},
    movetimes: {type: Date, required: true}						// for street-clean notifcations
});

const testDate = new Date('December 17, 1995 03:24:00');		// some arbitrary time
//const testNumber = 15105168560;									// this is my number dont call me
const testName = "Victor";										// switch to Apartment.user.name for each user



apt_schema.methods.sendNotifications = function(callback){
	const nowDate = new Date();
  console.log(nowDate)
  for (let i = 0; i < this.spots.length; i++) {
    if (this.spots[i]["movetime"] && this.spots[i]["phone"]) {
      let spotDate = new Date(this.spots[i]["movetime"])
      console.log(spotDate)
      console.log(new Date(spotDate.getTime() - 30*60000))
      if (nowDate >= spotDate - 30*60000 && nowDate <= spotDate - 29*60000) {
        console.log("got a need to move time for spot in pos " + i);
        let toNumber = this.spots[i]["phone"]
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
  if (callback){
    callback.call();
  }
}
const Apt = mongoose.model('Apt', apt_schema);

module.exports = Apt;
	// if (nowDate >= testDate){									// always true for testing rn
	// 	const client = new Twilio(twilio_sid, twilio_token);
	// 	const options = {
  //           to: `+ ${testNumber}`,
  //           from: `+ ${twilio_phone_number}`,
  //           /* eslint-disable max-len */
  //           body: `Hi ${testName}. Time to move your car!`,
  //           /* eslint-enable max-len */
  //       };
  //
  //       // client.messages.create(options, function(err, response) {
  //       //     if (err) {
  //       //         console.error(err);
  //       //     }
  //       //     else {
  //       //         console.log(`Message sent to ${testName}: ${testNumber}`);
  //       //     }
  //       // });
  //
  //       
	// }


