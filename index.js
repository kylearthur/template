const express = require('express')
require('./db/mongoose');

const userRouter = require('./routers/user')
const cashRouter = require('./routers/cash')
const cashoutRouter = require('./routers/cashout')
const cashinRouter = require('./routers/cashin')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(userRouter)
app.use(cashRouter)
app.use(cashoutRouter)
app.use(cashinRouter)




app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



