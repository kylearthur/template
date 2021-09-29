const mongoose = require('mongoose')

const jackpotSchema = mongoose.Schema({
    prize: {
        type: Number
        
    },
    color1: {
        type: String
    },
    color2: {
        type: String
    },
    color3: {
        type: String
    },


    date:{
        type: Number
       // default: new Date()
    },

    date_string:{
        type: String
       // default: new Date()
    },

    
    u_id: {
      type: String,
        required: true
    }
})



const Jackpot = mongoose.model('Jackpot',jackpotSchema)

module.exports = Jackpot