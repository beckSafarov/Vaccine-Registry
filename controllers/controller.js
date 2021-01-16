const express = require('express');
const jwt = require('jsonwebtoken'),
    User = require('../modules/user'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'),
    app = express(); 

//@desc      Index Page
//@route     GET /
//@access    Public
exports.indexPage = asyncHandler(async(req, res, next) => {
  res.render('index', {root: process.env.root});
});

//@desc      Register/make an appointment for vaccine
//@route     GET /register
//@access    Public
exports.register = asyncHandler(async(req, res, next) => {
    res.render('register', {root: process.env.root});
  });


//@desc      FAQ page
//@route     GET /faq
//@access    Public
exports.faq = asyncHandler(async(req, res, next) => {
  res.render('faq', {root: process.env.root});
});


//@desc      Full Info Page
//@route     GET /about
//@access    Public
exports.about = asyncHandler(async(req, res, next) => {
  res.render('fullinfo', {root: process.env.root});
});

//@desc      create/sign-up a new user,
//@route     POST /register
//@access    Public
exports.createNewUser = asyncHandler(async(req, res, next) => {
  const newUser = await User.create(req.body);
  newUser.getDayIntervals(); 
  newUser.save(); 
  res.status(201).json({
    success: true,
    data: newUser,
  });
});


// //@desc      create/sign-up a new user,
// //@route     PUT /register
// //@access    Public
// exports.updateExistingUser = asyncHandler(async(req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(req.body.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   updatedUser.getDayIntervals(); 
//   updatedUser.save(); 
//   res.status(201).json({
//     success: true,
//     data: updatedUser,
//   });
// });




