const express = require('express');
const jwt = require('jsonwebtoken'),
    User = require('../modules/user'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'),
    app = express(); 

//@desc      Index Page
//@route     GET /
//@access    Public
exports.indexPage = asyncHandler((req, res, next) => {
  res.render('index', {root: process.env.root});
});

//@desc      Register/make an appointment for vaccine
//@route     GET /register
//@access    Public
exports.register = asyncHandler((req, res, next) => {
    res.render('register', {root: process.env.root});
  });

//@desc      FAQ page
//@route     GET /faq
//@access    Public
exports.faq = asyncHandler((req, res, next) => {
  res.render('faq', {root: process.env.root});
});


//@desc      create/sign-up a new user,
//@route     POST /register
//@access    Public
exports.createNewUser = asyncHandler(async(req, res, next) => {
  const newUser = await User.create(req.body);
  console.log(req.body);
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

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
//@route     GET /admin/home
//@access    Private
exports.adminHome = asyncHandler(async(req, res, next)=>{
   console.log('adminHome controller is running...');
   res.render('adminHome', {root: process.env.root}); 
   res.redirect('/home');
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



