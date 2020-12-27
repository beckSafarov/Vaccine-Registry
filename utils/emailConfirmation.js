const express = require('express');
const asyncHandler = require('../middleware/async');
const nodemailer = require('nodemailer');


const sendEmailConfirmation = asyncHandler((user, payment)=>{
    console.log('sendEmailConfirmation function runs...'); 
    const output = `
        <h1> Your payment has been confirmed! </h1>
        <h3> Grab your slip </h3>
        <br>
        <div>
            <p><strong>Name:</strong> ${user.name} </p>
            <p><strong>Email:</strong> ${user.email} </p>
            <p><strong>Date of appointment:</strong>  ${user.date.toDateString()} </p>
            <p>${properTime(user.time)} </p>
            <p><strong>Place of appointment: Selangor, Petaling Jaya, IMA Clinic</strong></p>
            <p><strong>Number of vaccines bought:</strong> ${user.number} </p>
            <p><strong>Overall payed:</strong> ${parseInt(user.number) * 50} </p>
            <p><strong>Payer ID:</strong> ${payment.payerId} </p>
            <p><strong>Payment ID:</strong> ${payment.paymentId} </p>
            <p><strong>Payment Date:</strong> ${new Date()} </p>
        <br>
    `;
    console.log(output); 

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
        from: `Innovative Medical Aid <contact@ima-vaccine.com>`, 
        to: `${user.email}`, 
        subject: "Payment Confirmation",
        text: "Sample text", 
        html: output, 
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error); 
            console.log('Email could not be sent'); 
        }else{
            console.log('Message sent: %s');
        }
        
    })//end of the transporter.sendEmail 

}); //end of the send email confirmation 



//returns time in AM/PM format
let properTime = (time)=>{
    let identifier; 
    let hour = parseInt(time.slice(0,2));
    let minutes = time.slice(3,5);
    if(hour>12){
        hour -=12; 
        identifier = `PM`; 
    }else if(hour = 12){
        identifier = `PM`; 
    }else{
        identifier = 'AM'; 
    }

    return `<strong>Time of appointment:</strong> ${hour}:${minutes} ${identifier}`; 
}

module.exports = sendEmailConfirmation; 