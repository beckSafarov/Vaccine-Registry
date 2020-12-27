const mongoose = require('mongoose');
const slugify = require('slugify');
const crypto = require('crypto'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [30, 'Name cannot be more than 30 characters'],
      },
    slug: String,
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, 
    },
    date: {
      required: true,
      type: Date,
    },
    time: {
      required: true, 
      type: String
    },
    paid: {
      type: Boolean,
      default: false
    },
    number: {
      required: true, 
      type: Number
    }
})

// Create name slug from the name
userSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

//sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('user', userSchema);