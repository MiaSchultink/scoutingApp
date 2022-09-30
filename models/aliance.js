const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const alianceMemSchema = new Schema({
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
        type:Number
    },
    startPos2:{
        type:Number
    },
    startPos3:{
        type:Number
    },
})

module.exports = mongoose.model('AlianceMember', alianceMemSchema)