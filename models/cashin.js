const mongoose = require('mongoose')


const CashinSchema = mongoose.Schema({

    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    email : {
        type: String,
    },
    u_date_cashin:{
        type: Number
       // default: new Date()
    },

    u_date_cashin_string:{
        type: String
       // default: new Date()
    },
    attended_by:{
        type: String
    },
    date_attended: {
        type: Number
    },
    date_attended_string : {
        type: String
    },
    user_name : {
        type : String
    },
    gcash : {
        type : String
    },
  
})

const Cashin = mongoose.model('Cashin',CashinSchema )

module.exports = Cashin