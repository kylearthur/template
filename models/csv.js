const mongoose = require('mongoose')

const Csv = mongoose.model('Csv', {
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
        ref: 'User'
    },
    file_name:{
        type: String
    }
})

module.exports = Csv