const mongoose = require('mongoose')

const RoosterSchema = mongoose.Schema({
    type_of_rooster: {
        type: String,
        required: true,
     
    },
    
    wins: {
        type: Number,
        required: true,
   
    
    },
    loss : {
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
        required: true,
        ref: 'User'
    },
  
    
    
})




const Rooster = mongoose.model('Rooster',RoosterSchema )

module.exports = Rooster