
const Game = require('../models/game')
const Team = require('../models/team');

const ourUpcomingGames = []

exports.getAllGames = async (req, res, next) => {
    try {
        const games = await Game.find().populate('redAliance').populate('blueAliance').exec();
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
        const game = await Game.findById(gameId).populate('redAliance').populate('blueAliance').exec()

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
        const gameTime = req.body.gameTime;

        const red1 = req.body.redTeam1;
        const red2 = req.body.redTeam2;
        const red3 = req.body.redTeam3;
        const redAliance = [red1,red2,red3]

        const blue1 = req.body.blueTeam1;
        const blue2 = req.body.blueTeam2;
        const blue3 = req.body.blueTeam3;
        const blueAliance =[blue1, blue2, blue3];

        const game = new Game({
            name: gameName,
            type: gameType,
            time: gameTime,
            blueAliance: blueAliance,
            redAliance:redAliance
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

        const game= await Game.findById(gameId).populate('redAliance').populate('blueAliance').exec();
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
        const gameTime = req.body.gameTime;

        const red1 = req.body.redTeam1;
        const red2 = req.body.redTeam2;
        const red3 = req.body.redTeam3;
        const redAliance = [red1,red2,red3]

        const blue1 = req.body.blueTeam1;
        const blue2 = req.body.blueTeam2;
        const blue3 = req.body.blueTeam3;
        const blueAliance =[blue1, blue2, blue3];

        game.type = gameType;
        game.name = gameName;
        game.redAliance = redAliance;
        game.blueAliance= blueAliance;
        game.time = gameTime; 

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
            .populate('redAliance')
            .populate('blueAliance')
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