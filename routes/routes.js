const express = require('express'),
    router = express.Router(),
    {
      indexPage,
      register,
      faq,
      createNewUser,
      adminLoginPage,
      adminLogin,
    } = require('../controllers/controller');


router.route('/').get(indexPage);
router.route('/register').get(register).post(createNewUser);
router.route('/faq').get(faq);
router.route('/admin').get(adminLoginPage).post(adminLogin);
// router.route('/admin/dashboard').get(adminDashboard);



module.exports = router; 
