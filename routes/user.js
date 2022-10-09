const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

const isAuth = require('../middlewear/is-auth')
const isAdmin = require('../middlewear/is-admin')

router.get('/sign-up', userController.getSignUp);
router.post('/sign-up', userController.postSignUp);

router.get('/login', userController.getLogIn);
router.post('/login', userController.postLogin);

router.get('/reset', isAuth, userController.getReset)
router.post('/reset', isAuth, userController.postReset)

router.post('/logout', isAuth, userController.logout)

router.get('/profile', isAuth, userController.getUserProfile)
router.get('/profile/edit', isAuth, userController.getEditProfile)
router.post('/profile/edit', isAuth, userController.editProfile)

router.get('/reset',isAuth, userController.getReset)
router.post('/reset', isAuth, userController.postReset);

module.exports=  router;