const mongoose = require('mongoose')

const EntrySchema = mongoose.Schema({
    entry_no: {
        type: Number,
        required: true
        
    },
    breeder: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    weight: {
        type: Number,
        required: true
    },


    date:{
        type: Number
       // default: new Date()
    },
    fight_stats:{
        type: String
    },

    date_string:{
        type: String
       // default: new Date()
    },

    
    u_id: {
      type: String,
        required: true
    }
})



const Entry = mongoose.model('Entry',EntrySchema)

module.exports = Entry

