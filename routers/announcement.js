const express = require('express')
const Announcement = require('../models/announcement')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/announcement', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const announcement = new Announcement({
        "u_id" : body.u_id,
        "announcement":body.announcement,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })

    console.log(announcement)
    try {
        await announcement.save()
        let success_response = ({ message: "announcement created",  status: true , data: {announcement}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false},{   data : ""})
        res.status(200).send(err_response)
    }
})


router.get('/announcement_list', auth, async (req, res) => {
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
       const result = await  Announcement.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
        let success_response = ({ message: "announcement found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})






module.exports = router