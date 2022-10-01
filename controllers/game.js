
const Game = require('../models/game')
const Team = require('../models/team');
const Aliance = require('../models/aliance')

const ourUpcomingGames = []

exports.getAllGames = async (req, res, next) => {
    try {
        //const games = await Game.find().populate('ourAliance').populate('opposingAliance').exec();
        const games = await Game.find()
            .populate('ourAliance')
            .populate({
                path: 'ourAliance',
                populate: {
                    path: 'team1',
                    model: 'Team'
                }
            })
            .populate({
                path: 'ourAliance',
                populate: {
                    path: 'team2',
                    model: 'Team'
                }
            })
            .populate({
                path: 'ourAliance',
                populate: {
                    path: 'team3',
                    model: 'Team'
                }
            })
            .populate('opposingAliance')
            .populate({
                path: 'opposingAliance',
                populate: {
                    path: 'team1',
                    model: 'Team'
                }
            })
            .populate({
                path: 'opposingAliance',
                populate: {
                    path: 'team2',
                    model: 'Team'
                }
            })
            .populate({
                path: 'opposingAliance',
                populate: {
                    path: 'team3',
                    model: 'Team'
                }
            })
            .exec()

        const teams = await Team.find().exec();

        res.render('games', {
            games: games,
            teams: teams
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getGame = async (req, res, next) => {
    try {
        const gameId = req.params.gameId
        const game = await Game.findById(gameId)
        .populate({
            path: 'ourAliance',
            populate: {
                path: 'team1',
                model: 'Team'
            }
        })
        .populate({
            path: 'ourAliance',
            populate: {
                path: 'team2',
                model: 'Team'
            }
        })
        .populate({
            path: 'ourAliance',
            populate: {
                path: 'team3',
                model: 'Team'
            }
        })
        .populate('opposingAliance')
        .populate({
            path: 'opposingAliance',
            populate: {
                path: 'team1',
                model: 'Team'
            }
        })
        .populate({
            path: 'opposingAliance',
            populate: {
                path: 'team2',
                model: 'Team'
            }
        })
        .populate({
            path: 'opposingAliance',
            populate: {
                path: 'team3',
                model: 'Team'
            }
        }).exec()

        res.render('game', {
            game: game
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getAddGame = async (req, res, next) => {
    try {
        const teams = await Team.find().exec();
        res.render('add-game', {
            teams: teams
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }

}
exports.addGame = async (req, res, next) => {

    try {

        const gameType = req.body.gameType;
        const gameName = req.body.gameName;

        const opTeam1 = req.body.theirTeam1;
        const opTeam2 = req.body.theirTeam2;
        const opTeam3 = req.body.theirTeam3;

        const opPos1 = req.body.their1Pos;
        const opPos2 = req.body.their2Po2;
        const opPos3 = req.body.their3Pos;

        const opColor = req.body.theirColor;

        const opposingAliance = new Aliance({
            team1: opTeam1,
            team2: opTeam2,
            team3: opTeam3,
            color: opColor,
            startPos1: opPos1,
            startPos2: opPos2,
            startPos3: opPos3
        })
        await opposingAliance.save()
        //const opposingAliance = [opTeam1, opTeam2, opTeam3]

        const withTeam1 = req.body.ourTeam1;
        const withTeam2 = req.body.theirTeam2;
        const ourTeam = await Team.findOne({ number: 4338 }).exec();

        const ourPos1 = req.body.our1Pos;
        const ourPos2 = req.body.our2Pos;
        const ourPos3 = req.body.our3Pos;

        const ourColor = req.body.ourColor

        const ourAliance = new Aliance({
            team1: withTeam1,
            team2: withTeam2,
            team3: ourTeam,
            color: ourColor,
            startPos1: ourPos1,
            startPos2: ourPos2,
            startPos3: ourPos3
        })
        await ourAliance.save();

        //const ourAliance = [withTeam1, withTeam2, ourTeam]

        const gameTime = req.body.gameTime

        const game = new Game({
            name: gameName,
            type: gameType,
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
exports.getUpdateGame = async (req, res, next) => {
    try {
        const teams = await Team.find().exec();
        const gameId = req.params.gameId
        const game = await Game.findById(gameId).populate('ourAliance').populate('opposingAliance').exec()
        res.render('update-game.ejs', {
            teams: teams,
            game:game
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.updateGame = async (req, res, next) => {
    try {
        let game = await Game.findById(req.body.gameId).exec();

        const gameType = req.body.gameType;
        const gameName = req.body.gameName;

        const opTeam1 = req.body.theirTeam1;
        const opTeam2 = req.body.theirTeam2;
        const opTeam3 = req.body.theirTeam3;

        const opPos1 = req.body.their1Pos;
        const opPos2 = req.body.their2Po2;
        const opPos3 = req.body.their3Pos;

        const opColor = req.body.theirColor;

        let opposingAliance = await Aliance.findById(req.body.oppAlianceId).exec();

        opposingAliance.team1 = opTeam1;
        opposingAliance.team2 = opTeam2;
        opposingAliance.team3=opTeam3;
        opposingAliance.color = opColor;
        opposingAliance.startPos1 = opPos1;
        opposingAliance.startPos2 = opPos2;
        opposingAliance.startPos3 = opPos3;
        await opposingAliance.save();
        //const opposingAliance = [opTeam1, opTeam2, opTeam3]

        const withTeam1 = req.body.ourTeam1;
        const withTeam2 = req.body.theirTeam2;
        const ourTeam = await Team.findOne({ number: 4338 }).exec();

        const ourPos1= req.body.our1Pos;
        const ourPos2= req.body.our2Pos;
        const ourPos3= req.body.our3Pos;
        const ourColor = req.body.ourColor

        //const ourAliance = [withTeam1, withTeam2, ourTeam]
        let ourAliance = await Aliance.findById(req.body.ourAlianceId).exec();
        console.log(req.body.ourAlianceId)
        console.log(ourAliance)
        ourAliance.team1 = withTeam1;
        ourAliance.team2= withTeam2;
        ourAliance.team3 = ourTeam;
        ourAliance.startPos1 = ourPos1;
        ourAliance.startPos2 = ourPos2;
        ourAliance.startPos3 = ourPos3;
        
        ourAliance.color= ourColor
        await ourAliance.save();

        const gameTime = req.body.gameTime

        game.type = gameType;
        game.name = gameName
        game.opposingAliance = opposingAliance;
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

exports.deleteGame = async (req, res, next) => {
    try {
        // confirm("Are you sure you want to delete this game?");
        const game = await Game.findById(req.body.gameId).exec();
        if (ourUpcomingGames.includes(game)) {
            ourUpcomingGames.pull(game);
        }
        const ourAliance = await Aliance.findById(req.body.ourAlianceId).exec();
        const opposingAliance = await Aliance.findById(req.body.oppAlianceId).exec();
        await ourAliance.remove();
        await opposingAliance.remove();

        await game.remove()

        res.redirect('/game/all');
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.searchGames = async (req, res, next) => {
    try {
        const query = req.body.searchQuery
        console.log(query)
        const teams = await Team.find().exec()

        const games = await Game.find(
            {
                $and: [
                    { $text: { $search: query } }
                ]
            })
            .populate('ourAliance')
            .populate('opposingAliance')
            .exec();

        res.render('games', {
            games: games,
            teams: teams
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}