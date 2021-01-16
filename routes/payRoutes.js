const express = require('express'),
    router = express.Router(),
    {
      payPage,
      payPalPayment,
      successPage,
      errorPage,
      errorSandbox,
      paySandbox
    } = require('../controllers/paymentController.js');
  


router.route('/:id').get(payPage).post(payPalPayment); 
router.route('/success/:id').get(successPage); 
router.route('/error/:id').get(errorPage); 
router.route('/sandbox/error').get(errorSandbox); 
router.route('/sandbox/paypal').get(paySandbox); 


module.exports = router; 