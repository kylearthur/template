const mongoose = require('mongoose')

const fightSchema = mongoose.Schema({
    fight_number: {
        type: String,
        // required: true
       
    },
    winner: {
        type: String
    },
    winner_name: {
        type: String,
        default: "none"
    },
    status: {
        type: String,
        default: "pending"
    },
    date_string :{
        type : String
    },

    date :{
        type : Number
    },
    u_id: {
        type: String,
        ref: 'User'
    }, 
    manok1_id: {
        type: String,
        ref: 'User',
      
    }, 
    manok2_id: {
        type: String,
        ref: 'User',
       
    }, 
    meron_breeder: {
        type: String,
        // required: true
    },
    meron_desc: {
        type: String,
        // required: true
    },
    meron_weight: {
        type: String
    },
    date_of_fight: {
        type: String
    },
    wala_breeder: {
        type: String,
        // required: true
    },
    wala_desc: {
        type: String,
        // required: true
    },
    wala_weight: {
        type: String,
        // required: true
    },
    
    title: {
        type: String,
        // required: true
    }
})




const Fight = mongoose.model('Fight',fightSchema )

module.exports = Fight