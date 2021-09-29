const express = require('express')
const Archive = require('../models/archives')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/archives', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const archives = new Archive({
        "u_id" : body.u_id,
        "date":body.date,
        "time":body.time,
        "archive_site":body.archive_site,
       
    })

    console.log(archives)
    try {
        await archives.save()
        let success_response = ({ message: " created",  status: true , data: {archives}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false},{   data : ""})
        res.status(200).send(err_response)
    }
})


router.get('/archives_list', auth, async (req, res) => {
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
       const result = await  Archive.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
        let success_response = ({ message: " found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})






module.exports = router