const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost:127.0.0.1:27017/test25', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })

// mongoose.connect('mongodb://localhost/testdb')
// .then(() => {
// console.log("Connected to Database");
// }).catch((err) => {
//     console.log("Not Connected to Database ERROR! ", err);
// });

const url = 'mongodb://localhost/testdb'

// mongoose.connect(
//     url,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     function (err, res) {
//         try {
//             console.log('Connected to Database');
//         } catch (err) {
//             throw err;
//         }
//     })



    const connectDB = async () =>{
        const conn = await new mongoose(
            url,
        {
            usenewurlparser:true,
            usecreateindex:true,
            usefindmodify:true,
            useunifiedtropology:true,
            urlencoded:true
        })
}
module.exports = connectDB;


connectDB()
    .then(() => {
        app.listen(Port, console.log(`listening on port :${Port}` .red.underline.bold));
    }).catch((e) => {
        console.log(e);
    })
