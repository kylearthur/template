const mongoose = require('mongoose')

const apply_playerSchema = mongoose.Schema({
   my_master_agent_email:{
    type: String,
    required: true
   },
   my_agent_email:{
    type: String,
    required: true
   },
   email : {
    type: String,
    required: true
   },
    u_level: {
     type: String,
     default : "player"
    },

    date :{
        type : Number
    },
    master_id : {
        type: String,
      
        ref: 'User'
    },
    agent_id : {
        type: String,
      
        ref: 'User'
    },
    u_id: {
        type: String,
      
        ref: 'User'
    },
    
    
})




const Apply_player = mongoose.model('Apply_player',apply_playerSchema )

module.exports = Apply_player