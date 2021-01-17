const express = require('express'),
    router = express.Router(),
    {
      payPage,
      payPalPayment
    } = require('../controllers/livePayment.js');
  


router.route('/:id').get(payPage).post(payPalPayment); 


module.exports = router; 