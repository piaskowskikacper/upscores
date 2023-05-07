const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,   
    favourite: Array
})

const User = mongoose.model("user", userSchema, 'users');

module.exports = User;