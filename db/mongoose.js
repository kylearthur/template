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

// const url = 'mongodb://localhost/testdb'

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

// mongoose.connect('mongodb://localhost:27017/test').catch();

const start = async () => {
    
    if (!process.env.DB_URI) {
        throw new Error('auth DB_URI must be defined');
    }
    try {
        await mongoose.connect('mongodb://localhost:27017/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Server connected to MongoDb!');
    } catch (err) {
        throw new DbConnectionError();
        console.error(err);
    }

    const PORT = process.env.SERVER_PORT;
    app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}!!!!!!!!!`);
    });
};

start();