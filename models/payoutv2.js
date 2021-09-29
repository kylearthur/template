const mongoose = require('mongoose')

const payoutwoSchema = mongoose.Schema({
    
    u_id: {
        type: String,
        required: true,
        
    },

    date: {
        type: String,
        required: true,
        
    },

    details: {
        type: String,
        required: true,
        
    }

    ,

    transaction_type: {
        type: String,
        required: true,
        
    },

    user_name: {
        type: String,
        required: true,
        
    },
    
    my_master_agent_email: {
        type: String,
        required: true,
        
    },
    my_agent_email: {
        type: String,
        required: true,
        
    },
    status: {
        type: String,
        default: "pending",
        
    }
    
 
    
   
    
})




const Payoutwo = mongoose.model('Payoutwo',payoutwoSchema )

module.exports = Payoutwo