const express = require('express')
const Payin = require('../models/payin')
const auth = require('../middleware/auth')
const { findOne } = require('../models/payin')
const multer = require("multer");
const router = new express.Router()

const upload = multer({
    dest: "payin",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// router.post('/request_payin', auth ,  upload.single('payin'),async (req, res) => {
//     let ts = Math.round(Date.now() / 1000);
//     let body = req.body
//     req.user.payin = req.file.buffer
//     console.log('file' ,req.file)
//     const payin = new Payin({
//         "u_id" : body.u_id,
//         "email":body.email,
//         "my_master_agent_email":body.my_master_agent_email,
//         "my_agent_email":body.my_agent_email,
//         "payment_method":body.payment_method,
//         "amount":body.amount,
//         "date": ts,
//         "date_string": new Date(ts * 1000),
//         "file_name": req.file.originalname
//     })
//     try {
//         await payin.save()
//         res.status(201).send(payin)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })






router.get('/req_payin_list', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let email = req.query.email
    let u_id = req.query.u_id
    let my_master_agent_email = req.query.my_master_agent_email
    let my_agent_email = req.query.my_agent_email
    // console.log(req.query.u_level)
    if (!my_master_agent_email){
        my_master_agent_email = ""
     }else if(my_master_agent_email === 'all'){
        my_master_agent_email = ""
     }


    if (my_master_agent_email !== ""){ 
        // console.log("f_id != null")

                   
                    
                    const request_payin = await Payin.find({my_master_agent_email })
              
                    try{
                    
                
                        let success_response = ({ message: "found",  status: true , data: {request_payin}})
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
       const request_payin = await  Payin.find({ my_agent_email

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {request_payin}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }

}
})


router.get('/req_payin_list_user', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let email = req.query.email
    let u_id = req.query.u_id
    let my_master_agent_email = req.query.my_master_agent_email
    let my_agent_email = req.query.my_agent_email
    // console.log(req.query.u_level)
    if (!my_master_agent_email){
        my_master_agent_email = ""
     }else if(my_master_agent_email === 'all'){
        my_master_agent_email = ""
     }


    if (my_master_agent_email !== ""){ 
        // console.log("f_id != null")

                   
                    
                    const request_payin = await Payin.find({u_id})
              
                    try{
                    
                
                        let success_response = ({ message: "found",  status: true , data: {request_payin}})
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
       const request_payin = await  Payin.find({ my_agent_email

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {request_payin}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }

}
})


router.post('/payin/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const payin = await Payin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!payin) {
            return res.status(404).send()
        }

        res.send(payin)
    } catch (e) {
        res.status(400).send(e)
    }
})




module.exports = router