const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const gameStats = new Schema({

    game:{ //game name only
        type:String
    },
    ballsShot:{
        type:Number
    },
    ballsMissed:{
        type:Number
    },
    barReached:{
        type:String,
        enum: ['LOW','MID','HIGH','TRAVERSAL'],
        default: 'MID'
    },
    shootingConsistency:{
        type:Number
    },
    defenseBot:{
        type:String,
        enum: ['NOT','BAD','OK','GOOD'],
        default:'NOT'
    },
    comments:{
        type:String
    },
    autoBallsIn:{
        type:Number
    },
    movedInGame: {
        type: String,
        enum: ['YES', 'NO'],
        default: 'YES'
    },
    showedUpToGame: {
        type: String,
        enum: ['YES', 'NO'],
        default: 'YES'
    },
    climbed:{
        type:String,
        enum:['YES','NO']
    }
})

module.exports = mongoose.model('GameStats', gameStats)