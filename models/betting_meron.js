const mongoose = require('mongoose')

const Betting_meron = mongoose.model('Betting_meron', {
    amount: {
        type: Number
        
    },
    fight_number: {
        type: Number,
        required: true
    },
    u_date_bet:{
        type: Number
       // default: new Date()
    },

    u_date_bet_string:{
        type: String
       // default: new Date()
    },
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fight_id: {
        type: String,
        required: true
       
    },
    my_master_agent_email:{
        type: String,
        required: true
    }
    ,
    my_agent_email:{
        type: String,
        required: true
    }
    ,
    user_name:{
        type: String,
        required: true
    },
    commision:{
        type: Number,
        required: true
    }
})

module.exports = Betting_meron