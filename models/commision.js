const mongoose = require('mongoose')

const Commision = mongoose.model('Commision', {
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    my_master_agent_email: {
        type: String
     
    },
    my_agent_email: {
        type: String
     
    },
    u_id: {
        unique: true,
        type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
        ref: 'User'
    }
})

module.exports = Commision