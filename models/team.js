const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const teamSchema = new Schema({

    name:{
        type:String,
        required:true,
    },
    number:{
        type:Number,
        required: true,
        unique: true
    },
    robotType:{
        type:String,
        enum: ['TANK','SWERVE'],
        default:'TANK'
    },
    shooterType:{
        type:String,
        enum: ['LOW', 'HIGH'],
        default: "LOW"
    },
    barReached:{
        type:String,
        enum: ['LOW','MID','HIGH','TRAVERSAL'],
        default: 'MID'
    },
    climbingConsistency:{
        type:String,
        enum: ['BAD','OK','GOOD'],
        default:'OK'
    },
    shootingConsistency:{
        type:String,
        enum: ['BAD','OK','GOOD'],
        default:'OK'
    },
    autoConsistency:{
        type:String,
        enum: ['BAD','OK','GOOD'],
        default:'OK'
    },
    defenseBot:{
        type:String,
        enum: ['NOT','BAD','OK','GOOD'],
        default:'NOT'
    },
    numBallAuto:{
        type:Number,
        default:0
    },
    blueAlianceURL:{
        type:String,
        default:0
    },
    movedInLastGame:{
        type: String,
        enum:['YES','NO'],
        default: 'YES'
    },
    showedUpToLastGame:{
        type: String,
        enum:['YES','NO'],
        default: 'YES'
    },
    numBallsShot:{
        type:Number,
        default:0
    },
    numBallsMissed:{
        type:Number,
        default:0
    },
    teamWorkRating:{
        type:String,
        enum: ['SOLO',"TEAM"],
        default:'SOLO'
    },
    otherComments:{
        type:String
    }
})

module.exports = mongoose.model('Team', teamSchema)