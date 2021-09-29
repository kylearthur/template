const express = require('express')
const User = require('../models/user')
const User_level = require('../models/u_level')
const Payin = require('../models/payin')
const multer = require('multer')
 // const sharp = require('sharp')

const bcrypt = require('bcryptjs')
const Coins = require('../models/cash')
const auth = require('../middleware/auth')
const { off } = require('../models/user')
const Useractive = require('../models/useractive')
const {sendWelcomeEmail , sendCancelationEmail , sendForgotpass} = require('../mail/account')
const Cashv2 = require('../models/cash2')
const User_profile = require('../models/user_profile')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const body = req.body
    let ts = Math.round(Date.now() / 1000);
        let u_email = body.email
        let u_name = body.user_name
        let u_mobile = body.mobile_number


        let may_email = await User.findOne({email : u_email})

        let may_name = await User.findOne({user_name : u_name})

        let may_mobile = await User.findOne({mobile_number : u_mobile})

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

        if(may_mobile !== null){

            let err_response = ({ message : { error : "mobile number is already taken"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
        }



    const userInfo = {
        "email":body.email,
        "user_name":body.user_name,
        "country":body.country,
        "dial_code":body.dial_code,
        "password":body.password,
        "mobile_number":body.mobile_number,
        "complete_address" : body.complete_address,  
        "bank_acc" : body.bank_acc, 
        "fb" : body.fb,
        "age":body.age,
        "u_date_registered": ts,
        "u_date_registered_string": new Date(ts * 1000)
    }
    const user = new User(userInfo)
  
    let my_master_agent_email = ''
    let my_agent_email = ''
    let u_level = ''
    let email = body.email

   
    if(body.type === 'agent'){
     my_master_agent_email = body.extra_email
     my_agent_email = ''
     u_level = 'agent'
    } else if(body.type === 'player'){
        
        if(body.extra_email !== "null" ){

                
                 const ma = await User_level.findOne({email : body.extra_email})
                  my_master_agent_email = ma.my_master_agent_email
                  my_agent_email = body.extra_email
                u_level = 'player'
            }else{

                my_master_agent_email = 'isokraft@gmail.com'
                my_agent_email = 'contact@artpologabriel.com'
                u_level = 'player'
            }
    } else {

                my_master_agent_email = 'isokraft@gmail.com'
                my_agent_email = 'contact@artpologabriel.com'
                u_level = 'player'
    }
  
    
    await user.save()
    
    sendWelcomeEmail(user.email)
   
    const coinsInfo = {
        u_id: user.id,
        amount: 0,
        email :user.email,
        user_name:user.user_name,
        mobile_number: user.mobile_number

    }
    const coins = new Coins(coinsInfo)

    const cashInfov2 = {
        u_id: user.id,
        amountwo: 0,
        email :user.email,
        user_name:user.user_name,
        mobile_number: user.mobile_number

    }
    const cash2 = new Cashv2(cashInfov2)

    const uzer_level = {
        my_master_agent_email,
        my_agent_email,
        email,
        u_level,
        u_id: user.id,
        mobile_number: user.mobile_number ,
        amount: coins.amount ,
        "date": ts,
        "date_string": new Date(ts * 1000),
        user_name:user.user_name
    }

    console.log(user.mobile_number)

    
   

    const user_level = new User_level(uzer_level)

    const user_profile = {
        "u_id" : user.u_id,
        "mobile_number" : user.mobile_number,
        "user_name" : user.user_name,
        "complete_address" : user.complete_address,  
        "bank_acc" : user.bank_acc, 
        "fb" : user.fb,
        "date": ts,
        "date_string": new Date(ts * 1000)
    }

    const profile = new User_profile(user_profile)


    let transporter = nodemailer.createTransport({
        host: "mail.happymedadmin.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "no-reply@happymedadmin.com", // generated ethereal user
          pass: "bgEV{wbzn+3Q", // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"isokraft" <isokraft@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "UCfC", // Subject line
        text: "thanks for joining in", // plain text body
       
      });
    


    try {
        await profile.save()
        await coins.save()
        await cash2.save()
        await user_level.save()
        const token = await user.generateAuthToken()    
        let success_response = ({ message: "user creater",  status: true , data: {user, token , coins , cash2, user_level ,profile}})
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