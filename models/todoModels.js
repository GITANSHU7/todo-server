const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        message: 'Title field is required'
    },
    description: {
        type: String,
        trim: true,
        message: 'Description field is required'
    },
    status: {
        type: String,
        trim: true,
        enum: ['active', 'inactive', 'completed'],
        message: 'Status field is required'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);