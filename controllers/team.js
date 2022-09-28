const User = require('../models/user')
const Game = require('../models/game')
const Team = require('../models/team');

const YEAR = 2022;

exports.getAllTeams = async(req, res, next) =>{
    try{
        const teams = await Team.find().exec();

        res.render('teams', {
            teams:teams
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getTeam = async(req, res, next)=>{
    try{
        const team = await Team.find({_id:req.body.teamId}).exec()
        res.render('team',{
            team:team
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getAddTeam = async(req, res, next) =>{
    try{
        res.render('add-team')
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.addTeam = async(req, res, next) =>{
    try{
        const name = req.body.teamName
        const number = req.body.teamNumber
        const robotType = req.body.robotType
        const barReached = req.body.barReached
        const shooterType = req.body.shooterType
        const climbingConsistency = req.body.climbConsistency
        const shootingConsistency = req.body.shooterConsistency
        const defenseBot = req.body.defenseBot
        const numBallAuto = req.body.numBallAuto
        const otherComments = req.body.otherComments

        const url =  "https://www.thebluealliance.com/team/"+number+"/"+YEAR

        const teams = await Team.find().exec()
        for(let i=0; i<teams.length; i++){
            if(teams[i].number==number){
                res.render('message-sender',{
                    message: 'This team already exits'
                })
            }
        }

        const team = new Team({
            name: name,
            number: number,
            robotType: robotType,
            barReached: barReached,
            shooterType: shooterType,
            climbingConsistency: climbingConsistency,
            shootingConsistency: shootingConsistency,
            defenseBot: defenseBot,
            numBallAuto: numBallAuto,
            otherComments: otherComments,
            blueAlianceURL: url
        })

        await team.save()

        res.redirect('/team/all')
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getUpdateTeam = async(req, res, next) =>{
    try{
        const team = await Team.find({_id:req.body.teamId}).exec();

        res.render('update-team',{
            team:team
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.updateTeam = async(req, res, next) =>{
    try{
        let team = await Team.findById(req.body.teamId).exec();

        const name = req.body.teamName
        const number = req.body.teamNumber
        const robotType = req.body.robotType
        const barReached = req.body.barReached
        const shooterType = req.body.shooterType
        const climbingConsistency = req.body.climbConsistency
        const shootingConsistency = req.body.shooterConsistency
        const defenseBot = req.body.defenseBot
        const numBallAuto = req.body.numBallAuto
        const otherComments = req.body.otherComments

        const url =  "https://www.thebluealliance.com/team/"+number+"/"+YEAR

        team.name = name;
        team.number= number;
        team.robotType = robotType;
        team.barReached = barReached;
        team.shooterType = shooterType;
        team.climbingConsistency = climbingConsistency;
        team.shootingConsistency = shootingConsistency;
        team.defenseBot = defenseBot;
        team.numBallAuto = numBallAuto;
        team.otherComments = otherComments;
        team.blueAlianceURL = url;

        await team.save();

        res.redirect('/team/all')

    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.deleteTeam = async(req, res, next) =>{
    try{
        const team = await Team.findById(req.body.teamId).exec();
        const games = await Game.find().exec();

        for(let i=0; i<games.length; i++){
            if(games[i].ourAliance.includes(team)){
                games[i].ourAliance.pull(team)
                await games[i].save()
            }
            else if(games[i].opposingAliance.includes(team)){
                games[i].opposingAliance.pull(team)
                await games[i].save()
            }
        }

        await team.remove()
        res.redirect('/team/all')
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.searchTeams = async(req, res, next) =>{
    try{
        const number = req.body.searchQuery
        const team = await Team.find({number:number}).exec();

        res.render('teams',{
            teams:team
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}
