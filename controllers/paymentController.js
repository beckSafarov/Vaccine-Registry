    const paypal = require('paypal-rest-sdk');
    const express = require('express');
    const User = require('../modules/user');
    const ejs = require('ejs');
    const asyncHandler = require('../middleware/async');
    const ErrorResponse = require('../middleware/error');
    
    paypal.configure({
        'mode': 'sandbox', 
        'client_id': `${process.env.CLIENT_ID}`,
        'client_secret': `${process.env.CLIENT_SECRET}`
    });


    //@desc      get pay page 
    //@route     GET /pay/:id
    //@access    Public
    exports.payPage = asyncHandler(async(req, res, next) => {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(
                new ErrorResponse(`Such user not found`, 404)
                );
        }
        
        res.render('pay', {amount: user.number});
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
                "return_url": `http://localhost:5000/pay/success/${req.params.id}`,
                "cancel_url": "http://localhost:5000/pay/error"
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
              user.paid = true; 
              await user.save(); 
              res.render('success', {
                  user: user,
                  payment: paymentDetails
                });
            }
          });
    });//end of the successPage


    //@desc      get failed page, 
    //@route     GET /pay/error/:id
    //@access    Public
    exports.errorPage = asyncHandler(async(req, res, next) => {
        const user = await User.findById(req.params.id);
        res.render('unsuccessful', {user: user}); 
    });
