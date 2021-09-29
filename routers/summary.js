const express = require('express')
const Summary = require('../models/summary')
const auth = require('../middleware/auth')
const Payoutwo = require('../models/payoutv2')
const Payout = require('../models/payout')
const Betting_meron = require('../models/betting_meron')
const Betting_draw = require('../models/betting_draw')
const Betting_wala = require('../models/betting_wala')
const router = new express.Router()

router.post('/summary', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const summary = new Summary({
        "u_id" : body.u_id,
        "reference":body.reference,
        "title":body.title,
        "desc":body.desc,
        "status":body.status,
        "date":body.date,
        "time":body.time,
        
    })

    console.log(summary)
    try {
        await summary.save()
        let success_response = ({ message: "success",  status: true , data: {summary}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false},{   data : ""})
        res.status(200).send(err_response)
    }
})


router.delete('/summary/:id', auth, async (req, res) => {
    try {
        const summary = await Summary.findOneAndDelete({ _id: req.params.id })

        if (!summary) {
            res.status(404).send()
        }

        res.send(summary)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/summarys_list', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id

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
       const result = await  Summary.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})



router.get('/summary_report_list', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let email = req.query.email
    let u_id = req.query.u_id
    let my_master_agent_email = req.query.my_master_agent_email
    let my_agent_email = req.query.my_agent_email
    let status = req.query.status
    // console.log(req.query.u_level)
    if (!my_agent_email){
        my_agent_email = ""
     }else if(my_agent_email === 'all'){
        my_agent_email = ""
     }


    if (my_agent_email !== ""){ 
        // console.log("f_id != null")

                   
                    
                    const request_payout = await Payout.find({my_agent_email , status})
                    const request_payoutv2 = await Payoutwo.find({my_agent_email  , status})
                    const betting_meron = await Betting_meron.find({my_agent_email  })
                    const betting_wala = await Betting_wala.find({my_agent_email  })
                    const betting_draw = await Betting_draw.find({my_agent_email  })
                    

                    let obj = {
                        request_payout,
                        request_payoutv2,
                        betting_meron,
                        betting_wala,
                        betting_draw
                    }
                    
                    try{
                    
                
                        let success_response = ({ message: "found",  status: true , data: {obj}})
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
       const result = await  Payout.find({ my_agent_email , status

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }

}
})





module.exports = router