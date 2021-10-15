const express = require('express')
const webpush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')
const connectDB = require('./db/mongoose');

const userRouter = require('./routers/user')
const cashRouter = require('./routers/cash')
const cashoutRouter = require('./routers/cashout')
const cashinRouter = require('./routers/cashin')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "client")));

app.use(userRouter)
app.use(cashRouter)
app.use(cashoutRouter)
app.use(cashinRouter)


const publicVapidKey = 'BHZc9UBGKkPxoXfS8vHxkUsbFS-Dg0MrigIKxxUxpDdgEe2YdiubE618vE2zsh5hHyd2jJ5TGv6SK-2Hc1hFi7E';
const privateVapidKey = '2wgBhN-tShNmsIteHkIMnOx_rXn7z4BvNqwDwXtRZQ0';

webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey);


app.post('/subscribe',(req,res)=>{
    const subscription = req.body;

    res.status(201).json({})

    const payload = JSON.stringify({title : "notification"})

    webpush.sendNotification(subscription , payload).catch(err => console.error(err))
})



// app.listen(port, () => {
//     console.log('Server is up on port ' + port)
// })





connectDB()
    .then(() => {
        app.listen(Port, console.log(`listening on port :${Port}` .red.underline.bold));
    }).catch((e) => {
        console.log(e);
    })