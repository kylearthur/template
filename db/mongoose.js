const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost:127.0.0.1:27017/test25', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })

mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, res) {
        try {
            console.log('Connected to Database');
        } catch (err) {
            throw err;
        }
    })