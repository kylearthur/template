const mongoose = require('mongoose')

const payinSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    request_payin: {
     type: String
        
    },
    date_string :{
        type : String
    },

    date:{
        type : Number
    },
    attended_by : {
        type : Number
    },
    payment_method : {
        type: String
    },
    status : {
        type : String,
        default : "pending"
    },
    amount : {
        type : Number
    },
 
    
    u_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    my_master_agent_email: {
        type: String
    },
    
    my_agent_email: {
        type: String
    },
    file_name:{
        type: String
    },
    status :{
        type: String,
        default:"pending"
    }
    
})




const Payin = mongoose.model('Payin',payinSchema )

module.exports = Payin