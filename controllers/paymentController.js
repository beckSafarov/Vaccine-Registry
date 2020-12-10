    const paypal = require('paypal-rest-sdk');
    const express = require('express');
    const ejs = require('ejs');
    
    paypal.configure({
        'mode': 'sandbox', 
        'client_id': 'AXZFPiMO6_s4ZrbvuI8TUFzVzqk1jXmgu2-aaKCVv5drs1OgQYVH4mcL4RXDUgruj8AAZj1N1wCMfeNG',
        'client_secret': 'ECXr2o6IZb4z6bharG0NOGYP0h2vAPkbBpvQYS9zvlVLZxlFqcXzX6PIC4QiBjCANQqSHk5PDvFo0KOl'
    });


    //@desc      get pay page, 
    //@route     GET /pay/
    //@access    Public
    exports.payPage = (req, res, next) => {
        res.render('pay');
    };

    //@desc      get pay page, 
    //@route     POST /pay/
    //@access    Public
    exports.payPalPayment = (req, res, next) => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:5000/success",
                "cancel_url": "http://localhost:5000/cancel"
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
    };
    

    //@desc      get success page, 
    //@route     GET /pay/success
    //@access    Public
    exports.successPage = (req, res, next) => {
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
    };//end of the successPage


    //@desc      get failed page, 
    //@route     GET /pay/unsuccessful
    //@access    Public
    exports.errorPage = (req, res, next) => {
        res.render('unsuccessful')
    };
