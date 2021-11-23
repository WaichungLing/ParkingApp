const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const time_clean_schema = new Schema({
    day: Number,
    time: Number
})

const spot_schema = new Schema({
    person: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    time_cleaning: { type: time_clean_schema, required: true},
    time_move: { type: Date, required: true}
})

const Spot = mongoose.model('Spot', spot_schema);

module.exports = Spot;