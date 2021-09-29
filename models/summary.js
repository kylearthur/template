const mongoose = require('mongoose')

const SummarySchema = mongoose.Schema({

    u_id: {
        type: String,
      
        ref: 'User'
    },
    reference: {
        type: Number,
        required:true
    },
    title: {
        type: String,
        required:true
    },
    desc: {
        type: String,
        required:true
    },
    status: {
        type: String,
        required:true
    },
    date: {
        type: String,
        required:true
    },
    time: {
        type: String,
        required:true
    },
    
    
    
})




const Summary = mongoose.model('Summary',SummarySchema )

module.exports = Summary