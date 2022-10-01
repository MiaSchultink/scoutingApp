const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/sign-up', userController.getSignUp);
router.post('/sign-up', userController.postSignUp);

router.get('/login', userController.getLogIn);
router.post('/login', userController.postLogin);

router.get('/reset', userController.getReset)
router.post('/reset', userController.postReset)

router.post('/logout', userController.logout)

module.exports=  router;