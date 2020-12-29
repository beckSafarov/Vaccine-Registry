const jwt = require('jsonwebtoken'),
  asyncHandler = require('./async'),
  ErrorResponse = require('../utils/errorResponse'),
  User = require('../modules/user');

exports.urlDirect = asyncHandler(async(req, res, next)=>{
    const cookie = req.headers.cookie; 
    if(cookie && cookie.split('=')[0]==='token'){
        console.log(cookie.split('=')[1]);
        const decoded = jwt.verify(cookie.split('=')[1], process.env.JWT_SECRET); 
        res.redirect('/admin/home');
    }else{
        next();
    }
});

exports.protect = asyncHandler(async(req, res, next)=>{
    const cookie = req.headers.cookie; 
    if(cookie && cookie.split('=')[0]==='token'){
        const decoded = jwt.verify(cookie.split('=')[1], process.env.JWT_SECRET); 
        next(); 
    }else{
        res.redirect(`${process.env.root}/admin`)
    }
});

