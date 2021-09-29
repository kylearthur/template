const express = require('express')
const Cashout = require('../models/cashout')
const Cash = require('../models/cash')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/cashout', auth, async (req, res) => {
    body = req.body
    u_id = body.u_id
    value = body.amount
    let user_id = body.u_id
 
    const user_cash = await Cash.findOne({u_id : user_id})
    console.log('user_cash',user_cash.amount)
    if(user_cash.amount < 1){

        let err_response = ({ message : { error : "insuficient balance"} ,status: false,   data : ""})
    res.status(200).send(err_response)
        return
    }

    if(user_cash.amount < body.amount){
        let err_response = ({ message : { error : "insuficient balance"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
    }
    
  

    const c = await Cash.findOne({u_id})
    console.log(c)

    let total = c.amount - value; 


    const c2 = await Cash.findOneAndUpdate({u_id},  
        {amount: total}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });

    
    

    // const Cashout = new Cashout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        "amount":body.amount,
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

 const Cashout = new Cashout(info)
    try {
        await Cashout.save()
        let success_response = ({ message: "success",  status: true , data: {Cashout}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })







router.get('/cashout_list_admin', async (req, res) => {
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
       const result = await Cashout.find({   

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false},{   data : ""})
        res.status(200).send(err_response)  
    }
})



module.exports = router