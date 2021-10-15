const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost:127.0.0.1:27017/test25', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })

mongoose.connect('mongodb://localhost/testdb')
.then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});