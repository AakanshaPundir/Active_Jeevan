const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone:    String,
    condition:String,
    trainer:  String
});

module.exports = mongoose.model('User', userSchema);
