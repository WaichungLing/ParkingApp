const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    phone: { type: String, required: true}
})

user_schema.index({name: 1, email: 1, phone:1}, {unique: true});	// also reindexed via mongo shell so this might not be necessary but just in case if mongo restarts or something

const User = mongoose.model('User', user_schema);

module.exports = User;