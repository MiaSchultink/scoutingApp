const Game = require('../models/game')
const Team = require('../models/team');

const ourUpcomingGames = []

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

exports.getGame = async(req, res, next) =>{
    try{
        const gameId = req.params.gameId
        const game = await Game.findOne({_id: gameId}).populate('ourAliance').populate('opposingAliance').exec()

        res.render('game',{
            game:game
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
    const ourAliance = [withTeam1, withTeam2, ourTeam]
    const ourColor = req.body.ourColor

    const gameTime = req.body.gameTime

    const game = new Game({
        name: gameName,
        type:gameType,
        time: gameTime,
        ourAliance: ourAliance,
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
    try{
        const teams = await Team.find().exec();
        const gameId = req.params.gameId
        res.render('update-game.ejs',{
            teams:teams,
            gameId: gameId
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.updateGame = async(req, res, next) =>{
    try{
        let game = await Game.findById(req.body.gameId).exec();

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
        const ourAliance = [withTeam1, withTeam2, ourTeam]
        const ourColor = req.body.ourColor
    
        const gameTime = req.body.gameTime

        game.type=gameType;
        game.name = gameName
        game.opposingAliance = opposingAliance;
        game.theirColor = opColor;
        game.ourColor = ourColor;
        game.ourAliance = ourAliance;
        game.time = gameTime

        await game.save();

        res.redirect('/game/all')

    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.deleteGame = async(req, res, next) =>{
    try{
        const game = await Game.findById(req.body.gameId).exec();
        if(ourUpcomingGames.includes(game)){
            ourUpcomingGames.pull(game);
        }
        await game.remove()

        res.redirect('/game/all');
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}