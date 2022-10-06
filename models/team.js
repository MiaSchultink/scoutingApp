const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const teamSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    robotType: {
        type: String,
        enum: ['TANK', 'SWERVE'],
        default: 'TANK'
    },
    shooterType: {
        type: String,
        enum: ['LOW', 'HIGH'],
        default: "LOW"
    },
    barReached: {
        type: String,
        enum: ['LOW', 'MID', 'HIGH', 'TRAVERSAL'],
        default: 'MID'
    },
    climbingConsistency: {
        type:Number
    },
    shootingConsistency: {
        type:Number
    },
    autoConsistency: {
        type:Number
    },
    defenseBot: {
        type: String,
        enum: ['NOT', 'BAD', 'OK', 'GOOD'],
        default: 'NOT'
    },
    numBallAuto: {
        type: Number,
        default: 0
    },
    blueAlianceURL: {
        type: String,
        default: 0
    },
    showedUp:{
        type:Number,
        default:100
    },
    moved:{
        type:Number,
        default:100
    },
    numBallsShot: { 
        //average
        type: Number,
        default: 0
    },
    numBallsMissed: { //average
        type: Number,
        default: 0
    },
    gameStats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GameStats'
        }
    ],
    teamWorkRating: {
        type: String,
        enum: ['SOLO', "TEAM"],
        default: 'SOLO'
    },
    otherComments: {
        type: String
    }
})

module.exports = mongoose.model('Team', teamSchema)