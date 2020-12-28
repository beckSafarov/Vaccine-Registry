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


//@desc      get appointments,
//@route     POST /api/data
//@access    Private
exports.getData = asyncHandler(async(req, res, next) => {
   const users = await User.find({paid: true}).sort({date: 1}).exec(); 

   if(req.body.code !== process.env.DATA_SECRET){
      res.status(401).json({
        success: false, 
        error: 'Access denied',
        received: req.body.code,
        code: process.env.DATA_SECRET
      })
   }else{
      res.status(200).json({
        success: true, 
        data: users
      })
   }
});