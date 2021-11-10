const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apt_schema = new Schema({
    join_code: {type: Number, required: true},
    residents: [{ type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    num_lanes: { type: Number, required: true},
    num_spots: { type: Number, required: true},
    spots: {type: mongoose.Mixed, required: true}

})

const Apt = mongoose.model('Apt', apt_schema);

module.exports = Apt;