const mongoose = require('mongoose')


const CoinsinSchema = mongoose.Schema({

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
    mobile_number : {
        type : Number
    },
    user_name : {
        type : String
    },
    my_master_agent_email : {
        type : String
    },
    my_agent_email : {
        type : String
    },
    gcash : {
        type : String
    },
  
})

const Coinsin = mongoose.model('Coinsin',CoinsinSchema )

module.exports = Coinsin