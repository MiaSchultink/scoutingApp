
const Game = require('../models/game')
const Team = require('../models/team');
const GameStats = require('../models/gameStats');

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
        let teams = await Team.find().exec();
        if(teams.length==0){
            teams = []
        }
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
        const redAliance = [red1, red2, red3]

        const blue1 = req.body.blueTeam1;
        const blue2 = req.body.blueTeam2;
        const blue3 = req.body.blueTeam3;
        const blueAliance = [blue1, blue2, blue3];

        const game = new Game({
            name: gameName,
            type: gameType,
            time: gameTime,
            blueAliance: blueAliance,
            redAliance: redAliance
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

        const game = await Game.findById(gameId).populate('redAliance').populate('blueAliance').exec();
        res.render('update-game.ejs', {
            teams: teams,
            game: game
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
        const redAliance = [red1, red2, red3]

        const blue1 = req.body.blueTeam1;
        const blue2 = req.body.blueTeam2;
        const blue3 = req.body.blueTeam3;
        const blueAliance = [blue1, blue2, blue3];

        game.type = gameType;
        game.name = gameName;
        game.redAliance = redAliance;
        game.blueAliance = blueAliance;
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
        const game = await Game.findById(req.body.gameId).populate('blueAliance').populate('redAliance').exec();
        if (ourUpcomingGames.includes(game)) {
            ourUpcomingGames.pull(game);
        }
        const gameStats = await GameStats.find({game:game.name}).exec();

        for(let i=0; i<gameStats.length; i++){
            await gameStats[i].remove()
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

exports.getTeamView = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const team = await Team.find({ _id: teamId }).exec();
        res.render('team', {
            team: team
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getAddTeamStats = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const gameName = req.params.gameName;
        const team = await Team.findById(teamId).exec();

        res.render('add-team-stats', {
            teamId: teamId,
            team: team,
            gameName: gameName
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}
exports.addTeamStats = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const gameName = req.params.gameName;

        const team = await Team.findById(teamId).populate('gameStats').exec();
        const teamGameStats = team.gameStats;

        const barReached = req.body.barReached;
        const defenseBot = req.body.defense;
        const comments = req.body.statComments;

        const statBallsShot  = req.body.ballsShot;
        const statBallsMissed = req.body.ballsMissed;
        const shootingConsistency = 100*(1-(statBallsMissed/statBallsShot)); //relevant for game

        const climbedResult = req.body.climbed;
        const climbed = climbedResult=='on'? "YES":"NO";

        const autoBallsIn = req.body.autoBallsIn;

        let movedInGame= 'YES';
        const notMoved = req.body.movedInGame ;
        if(notMoved=='on'){
            movedInGame = 'NO';
        }

        let showedUpToGame = 'YES';
        const notShowed= req.body.showedUpToGame;
        if(notShowed=='on'){
            showedUpToGame='NO';
        }
        
    
        const gameStats = new GameStats({
            game: gameName,
            ballsShot: statBallsShot,
            ballsMissed: statBallsMissed,
            barReached: barReached,
            shootingConsistency: shootingConsistency,
            defenseBot: defenseBot,
            comments: comments,
            climbed:climbed,
            autoBallsIn: autoBallsIn,
            movedInGame: movedInGame,
            showedUpToGame: showedUpToGame
        }) 
        teamGameStats.addToSet(gameStats)

        console.log(teamGameStats)

        let sumBallsShot = 0;
        for(let i=0; i<teamGameStats.length; i++){
            sumBallsShot+=teamGameStats[i].ballsShot;
        }

        let sumBallsMissed =0;
        for(let i=0; i<teamGameStats.length; i++){
            sumBallsMissed+=teamGameStats[i].ballsMissed;
        }

        const ballsShot = sumBallsShot/teamGameStats.length;
        const ballsMissed = sumBallsMissed/teamGameStats.length;
        const ballsIn = ballsShot-ballsMissed

        const teamShootingConsistency = 100*(ballsIn/ballsShot);

        let numSuccessfullClimbs = 0;
        for(let i=0; i<teamGameStats.length; i++){
            if(teamGameStats[i].climbed=='YES'){
            numSuccessfullClimbs++;
            }
        }
        const climbConsistency = 100*(numSuccessfullClimbs/teamGameStats.length);

        team.numBallsShot = ballsShot;
        team.numBallsMissed = ballsMissed;
        team.climbingConsistency = climbConsistency
        team.shootingConsistency = teamShootingConsistency;

        let sumBallAuto = 0;
        for(let i=0; i<teamGameStats.length; i++){
            sumBallAuto+=teamGameStats[i].autoBallsIn;
        }
    
        const avrgBallsInAuto = sumBallAuto/teamGameStats.length;
        team.avrgBallsInAuto = avrgBallsInAuto;

        let numShowedUp = 0;
        for(let i=0; i<teamGameStats.length; i++){
            if(teamGameStats[i].showedUpToGame=='YES'){
                numShowedUp++;
            }
        }
        let numMoved = 0;
        for(let i=0; i<teamGameStats.length; i++){
            if(teamGameStats[i].movedInGame=='YES'){
                numMoved++;
            }
        }
        const showedUpRate = 100*(numShowedUp/team.gameStats.length);
        const movedRate = 100*(numMoved/team.gameStats.length);

        team.showedUp =showedUpRate;
        team.moved =movedRate;

        await gameStats.save();
        await team.save()

        res.redirect('/game/all')
    }

    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getTeamStats = async (req, res, next) => {
    try {
        const teamId = req.params.teamId;
        const team = await Team.findOne({ _id: teamId }).populate('gameStats').exec()
        const gameName = req.params.gameName;
        const teamGameStats = team.gameStats;
        let gameStats = null;

        for (let i = 0; i < teamGameStats.length; i++) {
            if (teamGameStats[i].game == gameName) {
                gameStats = teamGameStats[i]
            }
        }


        res.render('game-team-view', {
            team: team,
            gameName: gameName,
            gameStats: gameStats
        })

    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.getEditTeamStats = async (req, res, next) => {

    try {
        const teamId = req.params.teamId;
        const team = await Team.findOne({ _id: teamId }).populate('gameStats').exec()
        const gameName = req.params.gameName;
        const teamGameStats = team.gameStats;
        let gameStats = null;

        for (let i = 0; i < teamGameStats.length; i++) {
            if (teamGameStats[i].game == gameName) {
                gameStats = teamGameStats[i]
            }
        }

        res.render('edit-team-stats', {
            teamId: teamId,
            gameStats: gameStats,
            team:team,
            gameName:gameName
        })
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}

exports.editTeamStats = async(req, res,next) =>{
    try{
        const team = await Team.findById(req.body.teamId).populate('gameStats').exec();
        const gameName = req.body.gameName;
        const teamGameStats = team.gameStats;
        let gameStats = null;
        for (let i = 0; i < teamGameStats.length; i++) {
            if (teamGameStats[i].game == gameName) {
                gameStats = teamGameStats[i]
            }
        }
        const statBallsShot= req.body.ballsShot;
        const statBallsMissed =   req.body.ballsMissed;
        const shootingConsistency = 100*(1-(statBallsMissed/statBallsShot)); //relevant for game
        const defenseBot = req.body.defenseBotl;
        const barReached = req.body.barReached;
        const comments = req.body.barReached;
        const autoBallsIn = req.body.autoBallsIn;


        let climbed = "";
        const climbedResult = req.body.climbed;
        if(climbedResult=='on'){
            climbed='YES'
        }
        else{
            climbed='NO'
        }

        let movedInGame= 'YES';
        const notMoved = req.body.movedInGame ;
        if(notMoved=='on'){
            movedInGame = 'NO';
        }

        let showedUpToGame = 'YES';
        const notShowed= req.body.showedUpToGame;
        if
        (notShowed=='on'){
            showedUpToGame='NO';
        }

        gameStats.ballsShot =  statBallsShot;
        gameStats.ballsMissed = statBallsMissed;
        gameStats.shootingConsistency = shootingConsistency;
        gameStats.defenseBot = defenseBot;
        gameStats.comments = comments;
        gameStats.barReached =barReached;
        gameStats.climbed=climbed;
        gameStats.movedInGame = movedInGame,
        gameStats.showedUpToGame= showedUpToGame;
        gameStats.autoBallsIn = autoBallsIn

        let sumBallsShot = 0;
        for(let i=0; i<teamGameStats.length; i++){
            sumBallsShot+=teamGameStats[i].ballsShot;
        }

        let sumBallsMissed =0;
        for(let i=0; i<teamGameStats.length; i++){
            sumBallsMissed+=teamGameStats[i].ballsMissed;
        }

        const ballsShot = sumBallsShot/teamGameStats.length; //average
        const ballsMissed = sumBallsMissed/teamGameStats.length; //average
        const ballsIn = ballsShot-ballsMissed

        const teamShootingConsistency = 100*(ballsIn/ballsShot);

        let numSuccessfullClimbs = 0;
        for(let i=0; i<gameStats.length; i++){
            if(gameStats[i].climbed=='YES'){
            numSuccessfullClimbs++;
            }
        }
        const climbConsistency = 100*(numSuccessfullClimbs/team.gameStats.length);

        team.numBallsShot = ballsShot;
        team.numBallsMissed = ballsMissed;
        team.climbingConsistency = climbConsistency
        team.shootingConsistency = teamShootingConsistency;

        let sumBallAuto =0;
        for(let i=0; i<teamGameStats.length; i++){
            sumBallAuto+=teamGameStats[i].autoBallsIn;
        }
        const avrgBallsInAuto = sumBallAuto/teamGameStats.length;
        team.avrgBallsInAuto = avrgBallsInAuto

        let numShowedUp = 0;
        for(let i=0; i<teamGameStats.length; i++){
            if(teamGameStats[i].showedUpToGame=='YES'){
                numShowedUp++;
            }
        }
        let numMoved = 0;
        for(let i=0; i<teamGameStats.length; i++){
            if(teamGameStats[i].movedInGame=='YES'){
                numMoved++;
            }
        }
        const showedUpRate = 100*(numShowedUp/team.gameStats.length);
        const movedRate = 100*(numMoved/team.gameStats.length);

        team.showedUp =showedUpRate;
        team.moved =movedRate;

        await gameStats.save();
        await team.save();

        res.redirect('/game/all')
    }
    catch (err) {
        console.log(err)
        res.render('error')
    }
}