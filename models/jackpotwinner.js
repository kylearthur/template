const mongoose = require('mongoose')

const jackpotwinnerSchema = mongoose.Schema({
    jackpotwinner:{
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
      type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})



const Jackpotwinner = mongoose.model('Jackpotwinner',jackpotwinnerSchema)

module.exports = Jackpotwinner