const mongoose = require('mongoose')

const ArchiveSchema = mongoose.Schema({
    u_id: {
        type: String,
        ref: 'User'
    },
    date :{
        type : String
    },
    time :{
        type : String
    },
    archive_site :{
        type : String
    },
  
  
})




const Archive = mongoose.model('Archive',ArchiveSchema )

module.exports = Archive