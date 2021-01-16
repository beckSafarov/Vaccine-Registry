const paypal = require('paypal-rest-sdk');
const express = require('express');
const User = require('../modules/user');
const ejs = require('ejs');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const nodemailer = require('nodemailer');
const sendEmailConfirmation = require('../utils/emailConfirmation');


paypal.configure({
    'mode': 'sandbox',
    'client_id': `${process.env.CLIENT_ID}`,
    'client_secret': `${process.env.CLIENT_SECRET}`
});


//@desc      get pay page
//@route     GET /sandbox/pay/:id
//@access    Public
exports.payPage = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(
            new ErrorResponse(`Such user not found`, 404)
            );
    }

    res.render('payment/pay', {
        amount: user.number,
        root: process.env.root
    });
});


//@desc      get pay page
//@route     GET /pay/sandbox/paypal
//@access    Public
exports.paySandbox = asyncHandler(async(req, res, next) => {
    const amount = 2; 
    res.render('payment/pay', {
        amount,
        root: process.env.root,
    });
});


//@desc      make payment through Paypal
//@route     POST /pay/:id
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


//@desc      get success page,
//@route     GET /pay/success/:id
//@access    Public
exports.successPage = asyncHandler(async(req, res, next) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const user = await User.findById(req.params.id);
    const totalPrice = parseInt(user.number) * 50;
    const paymentDetails = {
        payerId,
        paymentId
    }
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
          "amount": {
            "currency": "USD",
            "total": `${totalPrice}`
          }
        }]
      };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment){
        if(error){
          console.log(error.response);
          throw error;
        }else{
          console.log(JSON.stringify(payment));
          user.paid = true; //change the user as paid
          await user.save(); //save the change
          sendEmailConfirmation(user, paymentDetails);  //send email confirmation about his payment
          res.render('payment/success', { //render the success page
              user: user,
              payment: paymentDetails,
              root: process.env.root
            });
        }
      });
});//end of the successPage


//@desc      get failed page,
//@route     GET /pay/error/:id
//@access    Public
exports.errorPage = asyncHandler(async(req, res, next) => {
    res.render('payment/unsuccessful', {
        root: process.env.root
    });
});

//@desc      test error,
//@route     GET /pay/sandbox/error
//@access    Public
exports.errorSandbox = asyncHandler(async(req, res, next) => {
    res.render('payment/unsuccessful', {
        root: process.env.root
    });
});
