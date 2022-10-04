const express = require('express');
const router = express.Router();

const isAuth = require('../middlewear/is-auth')
const isAdmin = require('../middlewear/is-admin')

const gameController = require('../controllers/game');

router.get('/all', isAuth, gameController.getAllGames)
router.get('/view/:gameId', isAuth, gameController.getGame)

router.get('/new', isAuth, gameController.getAddGame)
router.post('/new', isAuth, gameController.addGame)

router.get('/update/:gameId', isAuth, gameController.getUpdateGame)
router.post('/update', isAuth, gameController.updateGame)

router.get('/stats/:gameName/:teamId',isAuth, gameController.getTeamStats);
router.get('/stats/add/:gameName/:teamId',isAuth, gameController.getAddTeamStats)
router.post('/stats/add/:gameName/:teamId', isAuth, gameController.addTeamStats)

router.get('/stats/edit/:gameName/:teamId',isAuth, gameController.getEditTeamStats)
router.post('/stats/edit', isAuth, gameController.editTeamStats)

router.post('/search', isAuth, gameController.searchGames)

router.post('/delete', isAuth, gameController.deleteGame)
module.exports=  router;