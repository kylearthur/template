const mongoose = require('mongoose')

const totalSchema = mongoose.Schema({
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
    f_id: {
        type: String,
        ref: 'User',
        unique : true
    },
    fight_number: {
        type: Number
    },
    total_bet: {
        type: Number

    },
    total_bet_meron: {
        type: Number
      
    },
    total_bet_wala: {
        type: Number
      
    },
    total_bet_draw: {
        type: Number
    }
    ,
    winner: {
        type: String
    }


  
  
    
    
})




const Total = mongoose.model('totalSchema',totalSchema )

module.exports = Total