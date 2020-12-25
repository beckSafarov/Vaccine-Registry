const { red } = require('colors');
const express = require('express'); 
const nodemailer = require('nodemailer'),
    asyncHandler = require('../middleware/async'),
    mailgun = require('nodemailer-mailgun-transport'),
    errorResponse = require('../middleware/error'); 
const ErrorResponse = require('../utils/errorResponse');


//@desc      /
//@route     POST /email
//@access    Public
exports.emailSend = asyncHandler(async(req, res, next)=>{
    if(!req.body.name || !req.body.email || !req.body.message){
        return next(new ErrorResponse(`Data is not complete`, 404)
        )
    }
    const output = `
        <p> You have a new contact request</p>
        <h3> Contact Details </h3>
        <ul> 
            <li> Name: ${req.body.name}</li>
            <li> Email: ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

 
    let transporter = nodemailer.createTransport({
        host: "smtp.titan.email",
        port: 465,
        secure: true, 
        auth: {
            user: 'contact@ima-vaccine.com', 
            pass: process.env.EMAIL_PASSWORD, 
        },
        tls:{
            rejectUnauthorized: false
        }
    });
    

    let mailOptions = {
        from: `${req.body.name} <begzod.safarov07@gmail.com>`, 
        to: "contact@ima-vaccine.com", 
        subject: "Contact Email",
        text: "Sample text", 
        html: output, 
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error); 
            // res.render('index', {
            //     result: 'Email could not be sent',
            //     color: 'red'
            // })
        }
        // console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); 
        res.render('index', {
            result: 'Email has been sent', 
            color: 'red', 
            root: process.env.root
        }); 
    });

})//end of the emailSend