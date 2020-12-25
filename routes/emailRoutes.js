const express = require('express'),
    router = express.Router(), 
    {emailSend} = require('../controllers/emailController'); 


router.route('/').post(emailSend); 

module.exports = router; 
