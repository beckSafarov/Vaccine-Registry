const paypal = require('paypal-rest-sdk');
const express = require('express');
const User = require('../modules/user');
const ejs = require('ejs');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const nodemailer = require('nodemailer');
const sendEmailConfirmation = require('../utils/emailConfirmation');


paypal.configure({
    'mode': 'live',
    'client_id': `${process.env.CLIENT_LIVE_ID}`,
    'client_secret': `${process.env.CLIENT_LIVE_SECRET}`
});


//@desc      get pay page
//@route     GET /live/:id
//@access    Public
exports.payPage = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(
            new ErrorResponse(`Such user not found`, 404)
            );
    }
    paypal.configuration.mode = 'live';
    paypal.configuration.client_id = process.env.CLIENT_LIVE_ID;
    paypal.configuration.client_secret = process.env.CLIENT_LIVE_SECRET;
    
    res.render('payment/pay', {
        amount: user.number,
        root: process.env.root
    });
});



//@desc      make payment through Paypal
//@route     POST /live/:id
//@access    Public
exports.payPalPayment = asyncHandler(async(req, res, next) => {
    let user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorResponse(`Such user not found`, 404));
    }
    const totalPrice = parseInt(user.number) * 50;
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${process.env.root}/pay/success/${req.params.id}`,
            "cancel_url": `${process.env.root}/pay/error`
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "H01 vaccine",
                    "sku": "001",
                    "price": `${totalPrice}`,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": `${totalPrice}`
            },
            "description": "Vaccine for those who fear covid 19"
        }]
    };//end of the create payment json

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            for(let i = 0; i<payment.links.length; i++){
              if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
              }
            }
        }
    })//end of the paypal.payment function
});





