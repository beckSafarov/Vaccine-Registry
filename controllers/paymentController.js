    const paypal = require('paypal-rest-sdk');
    const express = require('express');
    const User = require('../modules/user');
    const ejs = require('ejs'),
        asyncHandler = require('../middleware/async'),
        ErrorResponse = require('../middleware/error');
    
    paypal.configure({
        'mode': 'sandbox', 
        'client_id': `${process.env.CLIENT_ID}`,
        'client_secret': `${process.env.CLIENT_SECRET}`
    });


    //@desc      get pay page 
    //@route     GET /
    //@access    Public
    exports.payPage = asyncHandler(async(req, res, next) => {
        res.render('pay');
    });

    //@desc      make payment through Paypal
    //@route     POST /
    //@access    Public
    exports.payPalPayment = asyncHandler(async(req, res, next) => {
        // const user = await User.findById(req.params.id);
        // if(!user){
        //     return next(new ErrorResponse(`Such user not found`, 404));
        // }
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/pay/success",
                "cancel_url": "http://localhost:5000/pay/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "H01 vaccine",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "Vaccine for those who believe in covid 19"
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
    //@route     GET /pay/success
    //@access    Public
    exports.successPage = asyncHandler(async(req, res, next) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
      
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
              "amount": {
                "currency": "USD",
                "total": "25"
              }
            }]
          };
          
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment){
            if(error){
              console.log(error.response);
              throw error; 
            }else{
              console.log(JSON.stringify(payment)); 
              res.render('success');
            }
          });
    });//end of the successPage


    //@desc      get failed page, 
    //@route     GET /pay/unsuccessful
    //@access    Public
    exports.errorPage = asyncHandler((req, res, next) => {
        res.render('unsuccessful')
    });
