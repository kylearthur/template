const express = require('express')
const Payoutwo = require('../models/payoutv2')
const auth = require('../middleware/auth')
const { findOne } = require('../models/payout')
const Cashv2 = require('../models/cash2')
const router = new express.Router()





    router.post('/request_payoutv2', auth, async (req, res) => {
        let ts = Math.round(Date.now() / 1000);
        let body = req.body
        let user_id = body.u_id
     
        const user_cash = await Cashv2.findOne({u_id : user_id})
        console.log('user_cash',user_cash.amountwo)
        if(user_cash.amountwo < 1){
    
            let err_response = ({ message : { error : "insuficient balance"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
        }
    
        if(user_cash.amountwo < body.amount){
            let err_response = ({ message : { error : "insuficient balance"} ,status: false,   data : ""})
            res.status(200).send(err_response)
                return
        }
        const payoutwo = new Payoutwo({
            "u_id" : body.u_id,
            "date":body.date,
            "details":body.details,
            "amountwo":body.amountwo,
            "transaction_type":body.transaction_type,
            "user_name":body.user_name,
            "my_master_agent_email":body.my_master_agent_email,
            "my_agent_email":body.my_agent_email,
           
        })
        try {
            await payoutwo.save()
            let success_response = ({ message: "success",  status: true , data: {payoutwo}})
            res.status(201).send(success_response)
        } catch (e) {
            let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
            res.status(200).send(err_response)  
        }
        })



        router.get('/req_payoutv2_list', auth, async (req, res) => {
            let lim = parseInt(req.query.limit) 
            let page = parseInt(req.query.page)
            let pg = (lim * page) - lim
            let email = req.query.email
            let u_id = req.query.u_id
            let my_master_agent_email = req.query.my_master_agent_email
            let my_agent_email = req.query.my_agent_email
            let status = req.query.status
            // console.log(req.query.u_level)
            if (!my_master_agent_email){
                my_master_agent_email = ""
             }else if(my_master_agent_email === 'all'){
                my_master_agent_email = ""
             }
        
        
            if (my_master_agent_email !== ""){ 
                // console.log("f_id != null")
        
                           
                            
                            const request_payout = await Payoutwo.find({my_master_agent_email  , status})
                      
                            try{
                            
                        
                                let success_response = ({ message: "found",  status: true , data: {request_payout}})
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
               const result = await  Payoutwo.find({ my_agent_email , status
        
                }).skip(pg).sort(sorter).limit(lim).exec()
               
                let success_response = ({ message: "found",  status: true , data: {result}})
                res.status(200).send(success_response)
            } catch (e){
                let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                res.status(200).send(err_response)  
            }
        
        }
        })


router.post('/payoutv2_update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const payoutv2 = await Payoutwo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!payoutv2) {
            return res.status(404).send()
        }

        res.send(payoutv2)
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router