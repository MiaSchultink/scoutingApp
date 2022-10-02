const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const gameSchema = new Schema({
    time:{
        type:String
    },
    type:{
        type:String,
        enum: ['PLAYOFF', 'QUALIFIER'],
        default: 'QUALIFIER'
    },
    name:{
        type:String,
        required: true,
    },
    redAliance:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Team'
        }
    ],
    blueAliance:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Team'
        }
    ]
})

module.exports = mongoose.model('Game', gameSchema)