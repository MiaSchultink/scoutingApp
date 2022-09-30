const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const gameSchema = new Schema({
    time:{
        type:String
    },
    type:{
        type:String,
        enum: ['PLAYOFF', 'QUALIFIER'],
        // required: true
    },
    name:{
        type:String,
        required: true,
    },
    ourAliance:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Team'
        }
    ],
    allience: [
        {
           type: {
                team: {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Team'
                },
                startingPosition: Number
           }
        }
    ],
    ourColor:{
        type:String,
        enum:['RED','BLUE']
    },
    opposingAliance:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Team'
        }
    ],
    theirColor:{
        type:String,
        enum:['RED','BLUE']
    },
})

module.exports = mongoose.model('Game', gameSchema)