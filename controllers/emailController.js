const { red } = require('colors');
const express = require('express');
const nodemailer = require('nodemailer'),
    asyncHandler = require('../middleware/async'),
    mailgun = require('nodemailer-mailgun-transport'),
    errorResponse = require('../middleware/error');
const ErrorResponse = require('../utils/errorResponse');


//@desc      send email
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
        tls: {
            rejectUnauthorized: false
        }
    });


    let mailOptions = {
        from: `${req.body.name} <contact@ima-vaccine.com>`,
        to:`contact@ima-vaccine.com`,
        subject: "Contact Email",
        text: "Sample text",
        html: output,
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
            res.status(500).json({
                success: false,
                msg: 'Failed to send!'
            })
        }else{
            console.log('Message sent...');
            res.status(200).json({
                success: true,
                msg: 'Email has been sent!'
            })
        };


    });//end of the .sendMail function

})//end of the emailSend
