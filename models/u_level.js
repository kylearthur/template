const mongoose = require('mongoose')

const user_levelSchema = mongoose.Schema({
    my_agent_email: {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    my_master_agent_email: {
        type: String,
        trim: true,
        lowercase: true
    },
    u_level: {
     type: String,
     default : ""
        
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
    active: {
        type: String,
        default: 'pending'
    },
    
    mobile_number: {
        type: String
    },
    amount: {
        type: Number
    },
    
    user_name: {
        type: String
    },


    
})




const User_level = mongoose.model('U_level',user_levelSchema )

module.exports = User_level