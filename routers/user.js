const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const Coins = require('../models/cash')
const nodemailer = require("nodemailer");
const auth = require('../middleware/auth')
const { off } = require('../models/user')
const fs = require('fs')
const hogan = require('hogan.js')
const router = new express.Router()


router.post('/register', async (req, res) => {
    const body = req.body
    let ts = Math.round(Date.now() / 1000);
        let u_email = body.email
        let u_name = body.user_name
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
  
    
  
    
   
    const cashInfo = {
        u_id: user.id,
        amount: 0,
        email :user.email,
        user_name:user.user_name

    }
    const cash = new Coins(cashInfo)


    let transporter = nodemailer.createTransport({
        host: "mail.happymedadmin.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "no-reply@happymedadmin.com", // generated ethereal user
          pass: "bgEV{wbzn+3Q", // generated ethereal password
        },
      });
    
      const template = fs.readFileSync("./emailtemp/index.html" , "utf-8")
      const compiledTemplates = hogan.compile(template)

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"happymed" <no-reply@happymedadmin.com>', // sender address
        to: user.email, // list of receivers
        subject: "HAPPYMED", // Subject line
        text: "thanks for joining in", // plain text body
        html: compiledTemplates.render()
       
      });



    try {
        await user.save()
        await cash.save()
        const token = await user.generateAuthToken()    
        let success_response = ({ message: "user creater",  status: true , data: {user, token , cash }})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "email has been already taken"} ,status: false, data : ""} )
         res.status(200).send(err_response)  
}
})



router.post('/login' ,async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.user_name, req.body.password)
            const token = await user.generateAuthToken()        
            let success_response = ({ message: "success",  status: true , data: {user, token}})
            res.send(success_response)
        } catch (e) {
            let err_response = ({ message : { error : "user name and password doesn`t match "} ,status: false,   data : ""})
            res.status(200).send(err_response)
        }
    
   
})


router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        let success_response = ({ message: "success"})
        res.send(success_response)
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/registered_list', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let user_name = req.query.user_name

    console.log(user_name)
    if (!user_name ){
        user_name = ""
     }else if( user_name === 'all'){
        user_name = ""
     }


    if (user_name !== ""){ 
        console.log("f_id != null")

                    let user = await User.find({user_name})

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



router.post('/forgot_pass',  async (req, res) => {
    const email = req.query.email
    const temp_pass = makeid(8)
    const temp_pass2 = await bcrypt.hash(temp_pass, 8)
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
                  let info =  transporter.sendMail({
                    from: '"happymed" <no-reply@happymedadmin.com>', // sender address
                    to: docs.email, // list of receivers
                    subject: "HAPPYMED", // Subject line
                    text: "this is your automated password please change it to a secured one " + temp_pass    // plain text body
                   
                  });
               
            } 
        });
        let success_response = ({ message: "please check your email",  status: true })
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



router.post('/upload', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
         req.user.save()
        let success_response = ({ message: "created",  status: true  })
        res.status(200).send(success_response)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})




router.get('/upload/:id', async (req, res) => {
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