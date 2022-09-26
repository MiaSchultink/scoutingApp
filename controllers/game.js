const Game = require('../models/game')
const Team = require('../models/team');

exports.getAllGames = async(req, res, next) =>{
    try{
        const games = await Game.find().populate('opposingAliance').populate('ourAliance').exec();
        const teams = await Team.find().exec();

        res.render('games',{
            games:games, 
            teams:teams,
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}
exports.getAddGame = async(req, res, next) =>{
    try{
        const teams = await Team.find().exec();
        res.render('add-game',{
            teams:teams
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }

}
exports.addGame = async(req, res, next) =>{

    try{

    const gameType = req.body.gameType;
    const gameName = req.body.gameName;

    const opTeam1 = req.body.theirTeam1;
    const opTeam2 = req.body.theirTeam2;
    const opTeam3 = req.body.theirTeam3;
    const opposingAliance = [opTeam1, opTeam2, opTeam3]
    const opColor = req.body.theirColor;

    const withTeam1 = req.body.ourTeam1;
    const withTeam2 = req.body.theirTeam2;
    const ourTeam = await Team.findOne({number: 4338}).exec();
    const ourALiance = [withTeam1, withTeam2, ourTeam]
    const ourColor = req.body.ourColor

    const gameTime = req.body.gameTime

    const game = new Game({
        name: gameName,
        type:gameType,
        time: gameTime,
        ourAliance: ourALiance,
        opposingAliance: opposingAliance,
        ourColor: ourColor,
        theirColor: opColor
    })

    await game.save();
    res.redirect('/game/all')

}
catch (err) {
    console.log(err)
    res.render('error')
}
    
}
exports.getUpdateGame = async(req, res, next) =>{
    
}

exports.updateGame = async(req, res, next) =>{
    
}

exports.deleteGame = async(req, res, next) =>{
    
}