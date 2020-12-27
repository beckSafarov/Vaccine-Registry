const jwt = require('jsonwebtoken'),
  asyncHandler = require('./async'),
  ErrorResponse = require('../utils/errorResponse'),
  User = require('../modules/user');

exports.urlDirect = asyncHandler(async(req, res, next)=>{
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        res.render('adminHome', {root: process.env.root} )
    }else{
        res.render('adminLogin', {root: process.env.root} )
    }
});

exports.protect = asyncHandler(async(req, res, next)=>{
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log('Authorization: '+req.headers.authorization); 
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        // res.render('adminHome', {root: process.env.root}); 
        next(); 
    }else{
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

