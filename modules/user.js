const mongoose = require('mongoose');
const slugify = require('slugify');
const crypto = require('crypto'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dateOps = require('../utils/dateOps');

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
    passed: {
      type: Boolean,
      default: false
    },
    regDate: {
      type: Date,
      default: Date.now()
    },
    dayIntervals: Number,
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
  next(); 
})

//Date operations
userSchema.pre('save', function(){
  //Creating String version of the date
  let date = this.date; 
  let day = date.getUTCDate()+1; 
  let month = date.getUTCMonth()+1; 
  let year = date.getUTCFullYear(); 
  this.dateInString = `${day}/${month}/${year}`; 

  //update or create date intervals between the current and the appointment dates
  this.getDayIntervals();

})


userSchema.methods.getDayIntervals = function(){
  let currentDate = new Date(); 
  const dateOp = new dateOps();
  let newUserDetails = dateOp.getAppointmentIntervals(this); 
  this.dayIntervals = newUserDetails.dayIntervals; 
  this.passed = newUserDetails.passed; 
}

//sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};



module.exports = mongoose.model('user', userSchema);