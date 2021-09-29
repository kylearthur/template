const mongoose = require('mongoose')

const ConvertSchema = mongoose.Schema({
    ph_amount: {
        type: Number,
        required: true
    },
    convert_usd: {
     type: Number,
     required: true
        
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
  
    
    
})




const Convert = mongoose.model('Convert',ConvertSchema )

module.exports = Convert