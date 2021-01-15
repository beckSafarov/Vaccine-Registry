const express = require('express');
const router = express.Router();
const {urlDirect, protect} = require('../middleware/auth');
const {
    adminLoginPage,
    adminLogin,
    adminHome,
    statsPage,
    searchPage,
    getUsers,
    logout
  } = require('../controllers/adminController');


router.route('/').get(urlDirect, adminLoginPage).post(adminLogin); 
router.get('/home', protect, adminHome); 
router.get('/stats', protect, statsPage); 
router.get('/search', protect, searchPage); 
router.get('/getusers', protect, getUsers); 
router.get('/logout', protect, logout); 



module.exports = router; 