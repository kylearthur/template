const express = require('express')
const Convert = require('../models/convert')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/convert', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const convert = new Convert({
        "u_id" : body.u_id,
        "ph_amount":body.ph_amount,
        "convert_usd":body.convert_usd,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await convert.save()
        let success_response = ({ message: "success",  status: true , data: {convert}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })


router.get('/convert_list', auth, async (req, res) => {
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
       const result = await  Convert.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})






module.exports = router