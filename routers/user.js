const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const Coins = require('../models/cash')
const auth = require('../middleware/auth')
const { off } = require('../models/user')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const body = req.body
    let ts = Math.round(Date.now() / 1000);
        let u_email = body.email
        let u_name = body.user_name
        let u_mobile = body.mobile_number


        let may_email = await User.findOne({email : u_email})

        let may_name = await User.findOne({user_name : u_name})


        if(may_email !== null){

            let err_response = ({ message : { error : "email is already taken"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
        }

        if(may_name !== null){

            let err_response = ({ message : { error : "user name is already taken"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
        }



    const userInfo = {
        "email":body.email,
        "user_name":body.user_name,
        "password":body.password,
        "age":body.age,
        "u_date_registered": ts,
        "u_date_registered_string": new Date(ts * 1000)
    }
    const user = new User(userInfo)
  
    
  
    
   
    const coinsInfo = {
        u_id: user.id,
        amount: 0,
        email :user.email,
        user_name:user.user_name

    }
    const cash = new Coins(coinsInfo)



    try {
        await user.save()
        await cash.save()
        const token = await user.generateAuthToken()    
        let success_response = ({ message: "user creater",  status: true , data: {user, token , cash }})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "email has been already taken"} ,status: false, data : ""} )
         res.status(200).send(err_response)  
    // res.status(400).send(e)
}
})



router.post('/users/login' ,async (req, res) => {

    let user_name = req.body.user_name
    const user_level = await User_level.findOne({user_name : req.body.user_name}).exec()
    console.log("u",user_level)
    if(user_level.active === "deactivated"){
        let err_response = ({ message : { error : "your account has been deactivated"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
    }

        try {
            const user = await User.findByCredentials(req.body.user_name, req.body.password)
            const token = await user.generateAuthToken()
            const user_name = req.body.user_name
            const u_id = user._id
            const useractive = await Useractive.findOne({ u_id: user._id}).exec()
            
            let success_response = ({ message: "success",  status: true , data: {user, token , user_level }})
            res.send(success_response)
        } catch (e) {
            let err_response = ({ message : { error : "user name and password doesn`t match "} ,status: false,   data : ""})
            res.status(200).send(err_response)
            // res.status(400).send(e)
        }
    
   
})







router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        sendCancelationEmail(req.user.email)
        let success_response = ({ message: "success"})
        res.send(success_response)
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/search', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let email = req.query.email

    console.log(req.query.email)
    if (!req.query.email ){
        req.query.email = ""
     }else if( req.query.email === 'all'){
        req.query.email = ""
     }


    if (req.query.email !== ""){ 
        console.log("f_id != null")

                    let user = await User.find({email})

                try{
                    let status = user.length >= 1 ?true : false
                    
                    let success_response = ({ message: "found",  status: status , data: {user}})
                    res.status(200).send(success_response)
                } catch (e) {
                    let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                    res.status(200).send(err_response)  
                }



    } else {

        console.log("f_id == null")
    let srt;
    if(req.query.sort == "desc"){
        srt = -1
    }else{
        srt = parseInt(req.query.sort)
    }
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "date"){
        sorter = {'date': srt}
    } else{
        sorter = {}
    }


    try {
       const user = await  User.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {user}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }

}
})



router.post('/users/me', auth, async (req, res) => {
    res.send(req.user)
})  



router.get('/userlist', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let u_level = req.query.u_level

    console.log(req.query.u_level)
    if (!req.query.u_level ){
        req.query.u_level = ""
     }


    if (req.query.u_level !== ""){ 
        console.log("f_id != null")

                    let user = await User.find({u_level})

                try{
                    
                
                    let success_response = ({ message: "found",  status: true , data: {user}})
                    res.status(200).send(success_response)
                } catch (e) {
                    let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                    res.status(200).send(err_response)  
                }



    } else {

        console.log("f_id == null")
    let srt;
    if(req.query.sort == "desc"){
        srt = -1
    }else{
        srt = parseInt(req.query.sort)
    }
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "date"){
        sorter = {'date': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await  User.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }

}
})

// x:{"$gte": Xstart, "$lt": Xend}, z:{"$gte": Zstart, "$lt": Zend}




router.post('/users/ako', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'email', 'password', 'mobiile_number']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(200).send({ status: "error", message: "invalid updates"})
    }
})

router.post('/change_password', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [  'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(200).send({ status: "error", message: "invalid updates"})
    }
})



router.post('/users/ako_assist',  async (req, res) => {
    const email = req.query.email
    const temp_pass = makeid(8)
    const temp_pass2 = await bcrypt.hash(temp_pass, 8)
    // sendForgotpass(find_user.email)
    

    const find_user = await User.find({email}).exec() 
    console.log(find_user)

    const u_id = find_user._id

    


    try{
        const ua = await User.findOneAndUpdate({u_id},  
            {password: temp_pass2}, null, function (err, docs) { 
            if (err){ 
                console.log(err) 
               // res.status(400).send()
            } 
            else{ 
                console.log("Original Doc : ",docs)
                //res.send(docs)    
            } 
        });
        let success_response = ({ message: "this is you automated password",  status: true , data: {temp_pass}})
        res.status(200).send(success_response)
    }catch (e){
        let err_response = ({ message : { error : "invalid email"} ,status: false},{   data : ""})
        res.status(200).send(err_response)  
    }
})



function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}




router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})






const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})



router.post('/request_payin', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const payin = new Payin({
        "u_id" : body.u_id,
        "email":body.email,
        "my_master_agent_email":body.my_master_agent_email,
        "my_agent_email":body.my_agent_email,
        "payment_method":body.payment_method,
        "amount":body.amount,
        "date": ts,
        "date_string": new Date(ts * 1000),
        "file_name": req.file.originalname

    })
    try {
        await payin.save()
        await req.user.save()
        let success_response = ({ message: "created",  status: true , data:{payin} })
        res.status(200).send(success_response)
    } catch (e) {
        res.status(400).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})




router.get('/payin/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})














module.exports = router