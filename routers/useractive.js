const express = require('express')
const Useractive = require('../models/useractive')
const auth = require('../middleware/auth')
const { off } = require('../models/useractive')
const router = new express.Router()



router.post('/user_active', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const useractive = new Useractive({
        "u_id" : body.u_id,
        "active":body.active,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await useractive.save()
        res.status(201).send(useractive)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/user_active_update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['active']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user_active = await Useractive.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!user_active) {
            return res.status(404).send()
        }

        res.send(user_active)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/useractive_list', auth, async (req, res) => {
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
       const result = await  Useractive.find({ u_id

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        res.send(result)
    } catch (e){
        res.status(404).send()
    }
})


router.get('/useractive_list_admin', auth, async (req, res) => {
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

    if(sortBy == "date"){
        sorter = {'date': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await  Useractive.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        res.send(result)
    } catch (e){
        res.status(404).send()
    }
})




module.exports = router
