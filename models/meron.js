const mongoose = require('mongoose')

const Meron = mongoose.model('Meron', {
    amount: {
        type: Number
        
    },
    u_date_win:{
        type: Number
       // default: new Date()
    },

    u_date_win_string:{
        type: String
       // default: new Date()
    },
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Meron