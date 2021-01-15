const express = require('express'),
    {urlDirect, protect} = require('../middleware/auth'),
    router = express.Router(),
    {
      indexPage,
      register,
      faq,
      createNewUser
    } = require('../controllers/controller');



router.route('/').get(indexPage);
router.route('/register').get(register).post(createNewUser);
router.route('/faq').get(faq);


module.exports = router; 
