const express = require('express');
const jwt = require('jsonwebtoken'),
    User = require('../modules/user'),
    asyncHandler = require('../middleware/async'),
    ErrorResponse = require('../utils/errorResponse'); 

//@desc      login page
//@route     GET /admin
//@access    Public
exports.adminLoginPage = asyncHandler((req, res, next) => {
    res.render('admin/adminLogin', {root: process.env.root});
 });


//@desc      admin credentials
//@route     POST /admin
//@access    Public
exports.adminLogin = asyncHandler((req, res, next) => { 
  const {email, pass} = req.body;
  // const user = User.find({email: email}).exec(); 
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
   let data = []; 
   let tab = 'todayTab'; 
   if(!req.query.filter || req.query.filter === 'today'){
    data = await User.find(
      {
        paid:true,
        passed: false,
        dayIntervals: {$lte: 1}
      }).sort({"date": 1, "timeInNumbers": 1});
  }else if(req.query.filter==='week'){
    data = await User.find(
     {
       paid:true,
       passed: false,
       dayIntervals: {$lte: 7}
     }).sort({"date": 1, "timeInNumbers": 1});
     tab = 'weekTab';
  }else if(req.query.filter==='all'){
     data = await User.find(
     {
       paid:true,
       passed: false
     }).sort({"date": 1, "timeInNumbers": 1});
     tab = 'allTab';
  }else if(req.query.filter==='past'){
     data = await User.find(
     {
       paid:true,
       passed: true
     }).sort({"date": 1, "timeInNumbers": 1});
     tab = 'pastTab';
    }//the end of req.query condition


   const stats = getStats(data); 
   res.render('admin/adminHome', {
     root: process.env.root,
     data: data,
     stats: stats,
     tab
    }); 
});

//@desc      admin stats
//@route     GET /admin/stats
//@access    Private
exports.statsPage = asyncHandler(async(req, res, next)=>{
  const data = await User.find({paid: true});
  const stats = getStats(data); 
  

  res.render('admin/stats', {
    root: process.env.root,
    stats
  })

});

//@desc      search Page
//@route     GET /admin/search?name=begzod
//@access    Private
exports.searchPage = asyncHandler(async(req, res, next)=>{
  let data = {};
  let message = ''; 
  let lastQuery = '';
  let found = false;  
   
  if(req.query.name){
    data = await User.findOne({slug: req.query.name});
    if(data === null ){
      let wrongQuery = req.query.name.split('-').join(' ');
      message = `No user found with name ${wrongQuery}`;
    }else{
      lastQuery = data.name;
      found = true;
    }
  }

  res.render('admin/search', {
    root: process.env.root,
    data,
    message,
    lastQuery,
    found
  })

});

//@desc      get users list
//@route     GET /admin/getusers
//@access    Private
exports.getUsers = asyncHandler(async(req, res, next)=>{
   const users = await User.find({paid: true}); 
   res.status(200).json({
     success: true,
     data: users
   }); 
});

//@desc      log out
//@route     GET /admin/logout
//@access    Private
exports.logout = asyncHandler(async(req, res, next)=>{
  res.clearCookie('token');

  res.status(200).json({
    success: true,
    message: 'Admin has been successfully kicked out'
  })
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
  const currentDate = new Date();
  let count = 0; //count vaccines sold in this month
  let sum = 0;  //
  let numberOfVaccines = 0;
  let pastAppointments = 0; 
  let upcomingAppointments = 0; 
  let total = 0;
  data.forEach(function(user){
    //get vaccines sold in this month
    if(user.regDate.getFullYear() === currentDate.getFullYear() && user.regDate.getMonth() === currentDate.getMonth()){
        count++; 
    }
    //number of vaccines sold
    numberOfVaccines += user.number; 

    if(user.date < currentDate){
      pastAppointments++;
    }else{
      upcomingAppointments++;
    }
  })

  //total revenue
  sum = numberOfVaccines * 50; 
  //total appointments 
  total = pastAppointments+upcomingAppointments;


  return {
    numberOfVaccines,
    sum,
    vaccinesSoldThisMonth: count,
    pastAppointments,
    upcomingAppointments,
    totalAppointments: total
  }
  
}





