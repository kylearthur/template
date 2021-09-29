const express = require('express')
const Coins = require('../models/cash')
const auth = require('../middleware/auth')
const { findOne, findByIdAndDelete, findByIdAndUpdate } = require('../models/coins')
const router = new express.Router()

router.post('/newcoin', auth, async (req, res) => {
    const coins = new Coins({
        "coins":req.body.coins,
        "u_id":req.body.u_id
    })

    try {
        await coins.save()
        res.status(200).send(coins)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/coinsdel/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['coins']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const coins = await Coins.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!coins) {
            return res.status(404).send()
        }

        res.send(coins)
    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router