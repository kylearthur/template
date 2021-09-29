const express = require('express')
const User_level = require('../models/u_level')
const auth = require('../middleware/auth')
const { findOne } = require('../models/u_level')
const router = new express.Router()

router.post('/u_level', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const user_level = new User_level({
        "u_id" : body.u_id,
        "my_agent_email" : body.my_agent_email,
        "my_master_agent_email" : body.my_master_agent_email,
        "email":body.email,
        "date": ts,
        "u_level":body.u_level,
        "date_string": new Date(ts * 1000)
    })
    try {
        await user_level.save()
        let success_response = ({ message: "success",  status: true , data: {user_level}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)
        // res.status(400).send(e)

    }
    })


    router.get('/user_level_list', auth, async (req, res) => {
        let lim = parseInt(req.query.limit) 
        let page = parseInt(req.query.page)
        let pg = (lim * page) - lim
        let u_id = req.query.u_id
        let u_level = req.query.u_level
    
        console.log(req.query.u_level)
        if (!req.query.u_level ){
            req.query.u_level = ""
         }else if( req.query.u_level === 'all'){
            req.query.u_level = ""
         }
    
    
        if (req.query.u_level !== ""){ 
            console.log("f_id != null")
    
                        let user = await User_level.find({u_level})
    
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
           const user = await  User_level.find({ 
    
            }).skip(pg).sort(sorter).limit(lim).exec()
           
            let success_response = ({ message: "found",  status: true , data: {user}})
            res.status(200).send(success_response)
        } catch (e){
            let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
            res.status(200).send(err_response)  
        }
    
    }
    })

    

    router.get('/my_underlings_agent', auth, async (req, res) => {
        let lim = parseInt(req.query.limit) 
        let page = parseInt(req.query.page)
        let pg = (lim * page) - lim
        let user_name = req.query.user_name
        let u_id = req.query.u_id
        let my_master_agent_email = req.query.my_master_agent_email
        let u_level = req.query.u_level
        let active = req.query.active
        
        
        
    
        // console.log(req.query.active)
        if (!req.query.u_level){
            req.query.u_level = ""
         }else if(req.query.u_level === 'all'){
            req.query.u_level = ""
         }
    
    
        if (req.query.u_level !== ""){ 
            // console.log("f_id != null")
    
                       
                        
           const user = await User_level.find({my_master_agent_email , u_level  ,active})
           console.log('user',user)
                  
                        try{
                        
                    
                            let success_response = ({ message: "found",  status: true , data: {user}})
                            res.status(200).send(success_response)
                        } catch (e) {
                            let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                            res.status(200).send(err_response)  
                        }
    
    
        } 
       
    })



    router.get('/my_underlings_player', auth, async (req, res) => {
        let lim = parseInt(req.query.limit) 
        let page = parseInt(req.query.page)
        let pg = (lim * page) - lim
        let user_name = req.query.user_name
        let u_id = req.query.u_id
        let my_agent_email = req.query.my_agent_email
        let u_level = req.query.u_level
        let active = req.query.active
        
        
        
    
        // console.log(req.query.active)
        if (!req.query.u_level){
            req.query.u_level = ""
         }else if(req.query.u_level === 'all'){
            req.query.u_level = ""
         }
    
    
        if (req.query.u_level !== ""){ 
            // console.log("f_id != null")
    
                       
                        
           const user = await User_level.find({my_agent_email , u_level ,user_name ,active})
           console.log('user',user)
                  
                        try{
                        
                    
                            let success_response = ({ message: "found",  status: true , data: {user}})
                            res.status(200).send(success_response)
                        } catch (e) {
                            let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                            res.status(200).send(err_response)  
                        }
    
    
        } 
       
    })



    router.post('/u_level_update/:id', async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['u_level']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
    
        try {
            const user_level = await User_level.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
            if (!user_level) {
                return res.status(404).send()
            }
    
            res.send(user_level)
        } catch (e) {
            res.status(400).send(e)
        }
    })



    router.post('/u_level_status_update/:id', async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['active']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
    
        try {
            const user_level = await User_level.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
            if (!user_level) {
                return res.status(404).send()
            }
    
            res.send(user_level)
        } catch (e) {
            res.status(400).send(e)
        }
    })


module.exports = router