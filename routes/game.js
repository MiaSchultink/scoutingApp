const express = require('express');
const router = express.Router();

const isAuth = require('../middlewear/is-auth')
const isAdmin = require('../middlewear/is-admin')

const gameController = require('../controllers/game');

router.get('/all', isAuth, gameController.getAllGames)

router.get('/new', isAuth, gameController.getAddGame)
router.post('/new', isAuth, gameController.addGame)

router.get('/update', isAuth, gameController.getUpdateGame)
router.post('/update', isAuth, gameController.updateGame)

router.post('/delete', isAuth, gameController.deleteGame)
module.exports=  router;