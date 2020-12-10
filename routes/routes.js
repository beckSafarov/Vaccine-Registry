const express = require('express'),
    router = express.Router(),
    {
      register,
      faq,
      createNewUser,
      adminLoginPage, 
      adminLogin,
      adminDashboard
    } = require('../controllers/controller');
  

router.route('/register').get(register).post(createNewUser);
router.route('/faq').get(faq); 
router.route('/admin').get(adminLoginPage).post(adminLogin);
router.route('/admin/dashboard').get(adminDashboard); 



module.exports = router; 