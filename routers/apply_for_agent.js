const express = require('express')
const Apply = require('../models/apply_for_agent')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/apply_for_agent', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const apply = new Apply({
        "my_master_agent_email" : body.my_master_agent_email,
        "master_id" : body.master_id,
        "u_id" : body.u_id,
        "email":body.email,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await apply.save()
        let success_response = ({ message: "success",  status: true , data: {apply}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })


    router.get('/applicants', auth, async (req, res) => {
    
        let lim = parseInt(req.query.limit) 
        let page = parseInt(req.query.page)
        let pg = (lim * page) - lim
        
        let srt;
        if(req.query.sort == "desc"){
            srt = -1
        }else{
            srt = parseInt(req.query.sort)
        }
        let sortBy = req.query.sortBy
        let sorter = null
    
        if(sortBy == "age"){
            sorter = {'age': srt}
        } else if(sortBy == "name"){
            sorter = {'name': srt}
        } else if(sortBy == "date"){
            sorter = {'u_date_registered': srt}
        }else{
            sorter = {}
        }
    
    
        try {
           const result = await Apply.find({
           // age : req.query.age
        //    age: {"$gte": req.query.ageStart, "$lt": req.query.ageEnd}
            }).skip(pg).sort(sorter).limit(lim).exec()
           
    
            res.send({data:{result}})
        } catch (e){
            let err_response = [{   data : ""},{ message : { error : "no result"}},{status: false}]
            res.status(200).send(err_response)
        }
    })
    




module.exports = router