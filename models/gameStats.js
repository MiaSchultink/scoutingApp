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
        type:String,
        enum: ['BAD','OK','GOOD'],
        default:'OK'
    },
    defenseBot:{
        type:String,
        enum: ['NOT','BAD','OK','GOOD'],
        default:'NOT'
    },
    comments:{
        type:String
    }
})

module.exports = mongoose.model('GameStats', gameStats)