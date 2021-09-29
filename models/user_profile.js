const mongoose = require('mongoose')

const User_profileSchema = mongoose.Schema({
    mobile_number: {
        type: String,
       
    },
    complete_address: {
        type: String,
        
    },
bank_acc: {
        type: String,
       
    },
    current_address: {
        type: String
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
    },fb: {
        type: String,
       
    },
  
    
    
})




const User_profile = mongoose.model('User_profile',User_profileSchema )

module.exports = User_profile