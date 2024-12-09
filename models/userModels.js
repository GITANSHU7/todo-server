const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        message: 'Name field is required'
    },
    username: {
        type: String,
        required: true,
        trim: true,
        message: 'Username field is required',
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        message: 'Email field is required',
        unique: true
    },

    userType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    password: {
        type: String,
        trim: true,
        message: 'Password field is required'
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);