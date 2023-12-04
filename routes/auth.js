const express= require("express");
const authController= require('../controllers/auth')
const router =express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/bmr', authController.calculateBMR);

module.exports=router;
