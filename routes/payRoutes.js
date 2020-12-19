const express = require('express'),
    router = express.Router(),
    {
      payPage,
      payPalPayment,
      successPage,
      errorPage
    } = require('../controllers/paymentController.js');
  


router.route('/:id').get(payPage).post(payPalPayment); 
router.route('/success/:id').get(successPage); 
router.route('/error/:id').get(errorPage); 


module.exports = router; 