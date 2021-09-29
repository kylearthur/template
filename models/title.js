const mongoose = require('mongoose')

const titleSchema = mongoose.Schema({
    title: {
        type: String,
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
    }
})




const title = mongoose.model('title',titleSchema )

module.exports = title