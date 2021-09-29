const mongoose = require('mongoose')

const announcementSchema = mongoose.Schema({
    announcement: {
        type: String,
        required: true
    },
 
    date_string :{
        type : String
    },

    date :{
        type : Number
    },
    u_id: {
        type: String,
        ref: 'User'
    }
})




const announcement = mongoose.model('announcement',announcementSchema )

module.exports = announcement