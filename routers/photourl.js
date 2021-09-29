const express = require('express')
const Photo = require('../models/photourl')
const auth = require('../middleware/auth')
const { off } = require('../models/photourl')
const router = new express.Router()






router.post('/photourl', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const photourl = new Photo({
        "u_id" : body.u_id,
        "url" : body.url,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await photourl.save()
        res.status(201).send(photourl)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/photourl_list', auth, async (req, res) => {
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
       const result = await  Photo.find({ u_id

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        res.send(result)
    } catch (e){
        res.status(404).send()
    }
})


router.get('/photourl_list_admin', auth, async (req, res) => {
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
       const result = await  Photo.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        res.send(result)
    } catch (e){
        res.status(404).send()
    }
})


module.exports = router