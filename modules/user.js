const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [30, 'Name cannot be more than 30 characters'],
      },
    slug: String,
    password: {
        type: String, 
        select: false
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, 
    },
    date: {
        type: Date, 
        unique: true
    }
})

module.exports = mongoose.model('user', userSchema);