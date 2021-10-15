const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:127.0.0.1:27017/test18', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})