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
    },
    timeInNumbers: Number,
    dateInString: String
})

// Create name slug from the name
userSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

//create number version of the time
userSchema.pre('save', function(){
  this.timeInNumbers = parseInt(this.time.split(':').join('')); 
})

//create String version of the date
userSchema.pre('save', function(){
  let date = this.date; 
  let day = date.getUTCDate()+1; 
  let month = date.getUTCMonth()+1; 
  let year = date.getUTCFullYear(); 
  this.dateInString = `${day}/${month}/${year}`; 
})

userSchema.pre('save', function(){
   let currentDate = new Date(); 
   if(this.date < currentDate){
     console.log(`${this.name}'s appointment has passed away`);
   }
});

//sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('user', userSchema);