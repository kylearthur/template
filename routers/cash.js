const express = require('express')
const Cash = require('../models/cash')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/cash', auth, async (req, res) => {
    u_id = req.body.u_id
    const mycash = await Cash.findOne({u_id}).exec(); 
    try {
        let success_response = ({ message: "success",  status: true , data: {mycash}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })



router.post('/cash/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['amount']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const cash = await Cash.findOne({ _id: req.params.id, u_id: req.user._id})

        if (!cash) {
            return res.status(404).send()
        }

        updates.forEach((update) => cash[update] = req.body[update])
        await cash.save()
        res.send(cash)
    } catch (e) {
        res.status(400).send(e)
    }
})










module.exports = router