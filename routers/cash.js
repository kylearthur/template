const express = require('express')
const Coins = require('../models/cash')
const auth = require('../middleware/auth')
const router = new express.Router()
const User = require('../models/user')

router.post('/cash', auth, async (req, res) => {
    u_id = req.body.u_id
    const mycoins = await Coins.findOne({u_id}).exec(); 
    try {
        let success_response = ({ message: "success",  status: true , data: {mycoins}})
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
        const coins = await Coins.findOne({ _id: req.params.id, u_id: req.user._id})

        if (!coins) {
            return res.status(404).send()
        }

        updates.forEach((update) => coins[update] = req.body[update])
        await coins.save()
        res.send(coins)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.get('/topthree', auth, async (req, res) => {
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

    if(sortBy == "coins"){
        sorter = {'coins': srt}
    } else{
        sorter = {}
    }   



    try {

       const result = await Coins.find({   
            coins:{$ne: null}
        }).skip(pg).sort(sorter).limit(lim).exec()

        let u_id1 = result[0].u_id;
        let u_id2 = result[1].u_id;
        let u_id3 = result[2].u_id;
        //let coins1 = result[0].coins;
       // let coins2 = result[1].coins;
       // let coins3 = result[2].coins;

       


        
       const user1 = await User.find({ _id : u_id1})
       const user2 = await User.find({ _id : u_id2})
       const user3 = await User.find({ _id : u_id3})


       let user1data = {
            "u_id": user1[0]._id,
            "name":user1[0].name,
            "coins": result[0].coins
             }
        
             let user2data = {
                "u_id": user2[0]._id,
                "name":user2[0].name,
                "coins": result[1].coins
                 }

                 let user3data = {
                    "u_id": user3[0]._id,
                    "name":user3[0].name,
                    "coins": result[2].coins
                     }

        let finalresult = {
            user1data, user2data, user3data
        }


        res.send(finalresult)
    } catch (e){
        res.status(404).send()
    }
})

router.get('/cash_list_admin', auth, async (req, res) => {
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

    if(sortBy == "coins"){
        sorter = {'coins': srt}
    } else{
        sorter = {}
    }   



    try {

       const result = await Coins.find({   

        }).skip(pg).sort(sorter).limit(lim).exec()

       


        res.send(result)
    } catch (e){
        res.status(404).send()
    }
})




module.exports = router