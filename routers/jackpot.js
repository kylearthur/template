const express = require('express')
const Jackpot = require('../models/jackpot')
const Jackpotwinner = require('../models/jackpotwinner')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/J', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const jackpot = new Jackpot({
        "u_id" : body.u_id,
        "color1":body.color1,
        "color2":body.color2,
        "color3":body.color3,
        "prize":body.prize,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await jackpot.save()
        res.status(201).send(jackpot)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/j_list', auth, async (req, res) => {
     
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
       const result1 = await Jackpot.find({

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        res.send(result1)
    } catch (e){
        res.status(500).send()
    }
})





router.post('/jw', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const jackpotwinner = new Jackpotwinner({
        "u_id" : body.u_id,
        "jackpotwinner" : body.jackpotwinner,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await jackpotwinner.save()
        res.status(201).send(jackpotwinner)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/jw_list', auth, async (req, res) => {
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

       const result = await Jackpotwinner.find({   

        }).skip(pg).sort(sorter).limit(lim).exec()

        let u_id1 = result[0].u_id;
        let u_id2 = result[1].u_id;
        let u_id3 = result[2].u_id;
      


        
       const user1 = await User.find({ _id : u_id1})
       const user2 = await User.find({ _id : u_id2})
       const user3 = await User.find({ _id : u_id3})
      



       let user1data = {
            "u_id": user1[0]._id,
            "name":user1[0].name,
            "jackpotwinner": result[0].jackpotwinner
         
             }
        
             let user2data = {
                "u_id": user2[0]._id,
                "name":user2[0].name,
                "jackpotwinner": result[1].jackpotwinner
               
                 }

                 let user3data = {
                    "u_id": user3[0]._id,
                    "name":user3[0].name,
                    "jackpotwinner": result[2].jackpotwinner
                  
                     }

        let finalresult = {
            user1data, user2data, user3data
        }


        res.send(finalresult)
    } catch (e){
        res.status(404).send()
    }
})

    module.exports = router