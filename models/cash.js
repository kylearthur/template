const mongoose = require('mongoose')

const Cash = mongoose.model('Cash', {
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    email: {
        type: String
     
    },
    user_name: {
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

module.exports = Cash