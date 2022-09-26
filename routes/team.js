const express = require('express');
const router = express.Router();

const isAuth = require('../middlewear/is-auth')
const isAdmin = require('../middlewear/is-admin')

const teamController = require('../controllers/team');

router.get('/all', isAuth, teamController.getAllTeams )

router.get('/new', isAuth, teamController.getAddTeam)
router.post('/new', isAuth, teamController.addTeam)

router.post('/delete', isAuth, teamController.deleteTeam)

router.get('/update',isAuth, teamController.getUpdateTeam)

module.exports=  router;