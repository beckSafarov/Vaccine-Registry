const express = require('express'),
    User = require('../modules/user'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse');

//@desc      Index Page
//@route     GET /
//@access    Public
exports.indexPage = asyncHandler((req, res, next) => {
  res.render('index', {
    result: '',
    color: 'black',
    root: process.env.root
  });
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


//@desc      admin dashboard
//@route     POST /admin
//@access    Public
exports.adminLogin = asyncHandler((req, res, next) => {
  const {email, pass} = req.body;
  console.log(req.body);
    if(email !== 'someone@gmail.com' || pass !== '123456'){
        res.status(400).json({
          success: false,
          error: 'Wrong Credentials'
        })
    }else{
      res.render('adminDashboard', {root: process.env.root});
    }
});
