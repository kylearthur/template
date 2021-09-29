const mongoose = require('mongoose')


const Cashin2Schema = mongoose.Schema({

    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amountwo: {
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
    }
  
})

const Cashin2 = mongoose.model('Cashin2',Cashin2Schema )

module.exports = Cashin2