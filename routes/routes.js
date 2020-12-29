const express = require('express'),
    {urlDirect, protect} = require('../middleware/auth'),
    router = express.Router(),
    {
      indexPage,
      register,
      faq,
      createNewUser
    } = require('../controllers/controller'),
    {
      adminLoginPage,
      adminLogin,
      adminHome
    } = require('../controllers/adminController');



router.route('/').get(indexPage);
router.route('/register').get(register).post(createNewUser);
router.route('/faq').get(faq);
router.route('/admin').get(urlDirect, adminLoginPage).post(adminLogin); 
router.get('/admin/home', protect, adminHome); 
// router.route('/admin').get(adminLoginPage).post(adminLogin);
// router.route('/admin/dashboard').get(adminDashboard);



module.exports = router; 
