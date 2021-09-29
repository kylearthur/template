const mongoose = require('mongoose')

const Coinsout = mongoose.model('Coinsout', {
    amount: {
        type: Number
        
    },
    u_date_cashout:{
        type: Number
       // default: new Date()
    },

    u_date_cashout_string:{
        type: String
       // default: new Date()
    },
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
       },

     via:{
            type: String
        },

    date_attended: {
            type: Number
        },

    date_attended_string : {
            type: String
        }  ,
        my_master_agent_email:{
            type: String,
       
        }
        ,
        my_agent_email:{
            type: String,
        
        }
        ,
        user_name:{
            type: String,
            
        }
})

module.exports = Coinsout