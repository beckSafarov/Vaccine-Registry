const mongoose = require('mongoose');
const slugify = require('slugify');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
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
      required: true,
      type: Date,
    },
    time: {
      required: true, 
      type: String
    }
})

// Create name slug from the name
userSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

module.exports = mongoose.model('user', userSchema);