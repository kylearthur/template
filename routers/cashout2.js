const express = require('express')
const auth = require('../middleware/auth')
const Cashv2 = require('../models/cash2')
const Cashout2 = require('../models/cashout2')
const router = new express.Router()

router.post('/cashoutv2', auth, async (req, res) => {
    body = req.body
    u_id = body.u_id
    value = body.amountwo
    let user_id = body.u_id
 
    const user_cash = await Cashv2.findOne({u_id : user_id})
    console.log('user_cash',user_cash.amountwo)
    if(user_cash.amountwo < 1){

        let err_response = ({ message : { error : "insuficient balance"} ,status: false,   data : ""})
    res.status(200).send(err_response)
        return
    }

    if(user_cash.amountwo < body.amountwo){
        let err_response = ({ message : { error : "insuficient balance"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
    }
    
  

    const c = await Cashv2.findOne({u_id})
    console.log(c)

    let total = c.amountwo - value; 


    const c2 = await Cashv2.findOneAndUpdate({u_id},  
        {amountwo: total}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });

    
    

    // const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        "amountwo":body.amountwo,
        "my_master_agent_email":body.my_master_agent_email,
        "my_agent_email":body.my_agent_email,
        "user_name":body.user_name,
        "u_date_cashout":ts,
          "u_id": u_id,
          "via":body.via,
          "date_attended":ts,
         "date_attended_string":new Date(ts * 1000),
        "u_date_cashout_string": new Date(ts * 1000)
    }

 const cashout2 = new Cashout2(info)
    try {
        await cashout2.save()
        let success_response = ({ message: "success",  status: true , data: {cashout2}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
        // res.status(400).send(e)
    }
    })



router.get('/cashout_listv2_for_master', async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let srt;
    let my_master_agent_email = req.query.my_master_agent_email
    if(req.query.sort == "desc"){
        srt = -1
    }else{
        srt = parseInt(req.query.sort)
    }
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "u_date_cashout"){
        sorter = {'u_date_cashout': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Cashout2.find({ my_master_agent_email

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})



router.get('/cashout_listv2_for_agent', async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let srt;
    let my_agent_email = req.query.my_agent_email
    if(req.query.sort == "desc"){
        srt = -1
    }else{
        srt = parseInt(req.query.sort)
    }
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "u_date_cashout"){
        sorter = {'u_date_cashout': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Cashout2.find({ my_agent_email

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})


router.get('/cashout_list_adminv2', async (req, res) => {
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

    if(sortBy == "u_date_cashout"){
        sorter = {'u_date_cashout': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Cashout2.find({   

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false},{   data : ""})
        res.status(200).send(err_response)  
    }
})



module.exports = router