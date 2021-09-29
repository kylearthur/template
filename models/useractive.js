const mongoose = require('mongoose')

const user_activeSchema = mongoose.Schema({
    active: {
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
      unique: true,
        ref: 'User'
    },
  
    
    
})




const Useractive = mongoose.model('Useractive',user_activeSchema )

module.exports = Useractive