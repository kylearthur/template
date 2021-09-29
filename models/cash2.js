const mongoose = require('mongoose')

const Cashv2 = mongoose.model('Cashv2', {
    amountwo: {
        type: Number,
        required: true,
        default: 0
    },
    email: {
        type: String
     
    },
    user_name: {
        type: String
     
    },mobile_number: {
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

module.exports = Cashv2