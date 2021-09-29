const mongoose = require('mongoose')

const photoSchema = mongoose.Schema({
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
    url : {
        type: String,
        require:true
    }
  
    
    
})




const Photo = mongoose.model('Photo',photoSchema )

module.exports = Photo