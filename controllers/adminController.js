const express = require('express');
const jwt = require('jsonwebtoken'),
    User = require('../modules/user'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'); 

//@desc      login page
//@route     GET /admin
//@access    Public
exports.adminLoginPage = asyncHandler((req, res, next) => {
    res.render('adminLogin', {root: process.env.root});
 });


//@desc      admin credentials
//@route     POST /admin
//@access    Public
exports.adminLogin = asyncHandler((req, res, next) => { 
  const {email, pass} = req.body;
  const user = User.find({email: email}).exec(); 
    if(email !== process.env.ADMIN_EMAIL || pass !== process.env.ADMIN_PASSWORD){
        res.status(400).json({
          success: false,
          error: 'Invalid Credentials',
          data: req.body
        })
    }else{
        sendTokenResponse(pass, 200, res); 
    }
});

//@desc      admin dashboard
//@route     GET /admin/:code/home
//@access    Private
exports.adminHome = asyncHandler(async(req, res, next)=>{
   const data = await User.find({paid: true}).sort({"date": 1, "timeInNumbers": 1});
   const stats = getStats(data); 
   res.render('adminHome', {
     root: process.env.root,
     data: data,
     stats: stats
    }); 
});

 //get token from model, create cookie and send response
 const sendTokenResponse = (password, statusCode, res) => {
  //create token
  const token = jwt.sign({pass: password}, process.env.JWT_SECRET),
  options = {
      httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token
  });
};

function getStats(data){
  let sum = 0; 
  let numberOfVaccines = 0;
  data.forEach(function(user){
    numberOfVaccines += user.number; 
  })
  sum = numberOfVaccines * 50; 
  return {
    numberOfVaccines,
    sum
  }
  
}





