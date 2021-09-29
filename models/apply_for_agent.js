const mongoose = require('mongoose')

const applySchema = mongoose.Schema({
   my_master_agent_email:{
    type: String,
    required: true
   },
   email : {
    type: String,
    required: true
   },
    u_level: {
     type: String,
     default : "agent"
        
    },
 
    date_string :{
        type : String
    },

    date :{
        type : Number
    },
    master_id : {
        type: String,
      
        ref: 'User'
    },
    u_id: {
        type: String,
      
        ref: 'User'
    },
  
    
    
})




const Apply = mongoose.model('Apply',applySchema )

module.exports = Apply