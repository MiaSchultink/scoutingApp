const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const alianceSchema = new Schema({
    color:{
        type:String,
        enum:['RED','BLUE']
    },
    team1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    team2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    team3:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },
    startPos1:{
        type:Number,
        enum:[1,2,3,4,5,6],
        default:1
    },
    startPos2:{
        type:Number,
        enum:[1,2,3,4,5,6],
        default:1
    },
    startPos3:{
        type:Number,
        enum:[1,2,3,4,5,6],
        default:1
    },
})

module.exports = mongoose.model('Aliance', alianceSchema)