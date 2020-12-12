const mongoose = require('mongoose');

// ----- Empèche la création de plusieurs compte à partir de la même adresse Email ----- // 

const uniqueValidator = require('mongoose-unique-validator');

// ----- Model d'utilisateur ----- // 

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);