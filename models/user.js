const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = User = mongoose.model('User', userSchema);