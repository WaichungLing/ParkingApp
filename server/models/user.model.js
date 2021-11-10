const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    phone: { type: String, required: true}
})

const User = mongoose.model('User', user_schema);

module.exports = User;