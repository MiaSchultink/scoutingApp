const User = require('../models/user')
const Game = require('../models/game')
const Team = require('../models/team');
const GameStats = require('../models/gameStats');

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
        const team = await Team.findOne({_id:req.params.teamId}).populate('gameStats').exec()

        const teamGames = [];
        const allGames = await Game.find();

        for(let i=0; i<allGames.length; i++){
            if(allGames[i].blueAliance.includes(team._id).toString()||allGames[i].redAliance.includes(team._id).toString()){
                teamGames.push(allGames[i])
            }
        }

        const gamesWithStats = [];
        for(let i=0; i<team.gameStats.length; i++){
            const gameWithStats = await Game.findOne({name:team.gameStats[i].game}).exec();
            gamesWithStats.push(gameWithStats)
        }

        console.log(gamesWithStats)
        res.render('team',{
            team:team,
            teamGames: gamesWithStats
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
       
        const climbingConsistency = 0;
        const shootingConsistency = 0;
        //const autoConsitency = 0;

        const defenseBot = req.body.defenseBot
        const teamWorkRating = req.body.teamWork;

        const numBallAuto = req.body.numBallAuto;
        const avrgBallsInAuto = 0;
        const ballsShot = 0;
        const ballsMissed = 0;

        const moved = 100;
        const showedUp =100;
        const numMoved = 0;
        const numShowedUp=0;
        const numSuccessfullClimbs = 0;

        const gameStats= [];

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
            blueAlianceURL: url,
            ballsShot: ballsShot,
            ballsMissed: ballsMissed,
            moved: moved,
            showedUp: showedUp,
            teamWorkRating: teamWorkRating,
            //autoConsistency: autoConsitency, 
            avrgBallsInAuto: avrgBallsInAuto,
            gameStats: gameStats,
            numMoved:numMoved,
            numShowedUp:numShowedUp,
            numSuccessfullClimbs:numSuccessfullClimbs,
            blueAlianceURL:url
        })

        await team.save();

        res.redirect('/team/all')
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getUpdateTeam = async(req, res, next) =>{
    try{
        const team = await Team.findOne({_id:req.params.teamId}).exec();

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
        // const climbingConsistency = req.body.climbConsistency
        // const shootingConsistency = req.body.shooterConsistency
        const defenseBot = req.body.defenseBot
        const numBallAuto = req.body.numBallAuto
        const otherComments = req.body.otherComments

        const url =  "https://www.thebluealliance.com/team/"+number+"/"+YEAR

        team.name = name;
        team.number= number;
        team.robotType = robotType;
        team.barReached = barReached;
        team.shooterType = shooterType;
        // team.climbingConsistency = climbingConsistency;
        // team.shootingConsistency = shootingConsistency;
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
    // confirm("Are you sure you want to delete this team?");
        const team = await Team.findById(req.body.teamId).exec();
        const games = await Game.find().exec();

        for(let i=0; i<games.length; i++){
            if(games[i].redAliance.includes(team._id)){
                games[i].redAliance.pull(team._id)
                await games[i].save()
            }
            else if(games[i].blueAliance.includes(team._id)){
                games[i].blueAliance.pull(team._id)
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

exports.viewPerformanceInGame = async(req, res, next) =>{
    try{
        const team = await Team.findById(req.params.teamId).populate('gameStats').exec();
       
        const gameName = req.params.gameName;

        let statsForGame = null;
        for(let i=0; i<team.gameStats.length; i++){
            if(team.gameStats[i].game==gameName){
                statsForGame = team.gameStats[i];
            }
        }

        res.render('view-team-stats',{
            team:team,
            gameStats: statsForGame,
            gameName:gameName
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}
