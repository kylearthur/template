const express = require('express')
const Total = require('../models/totalbets')
const auth = require('../middleware/auth')
const Fight = require('../models/createfight')
const Betting_wala = require('../models/betting_wala')
const Betting_meron = require('../models/betting_meron')
const Betting_draw = require('../models/betting_draw')
const router = new express.Router()

router.post('/bets', auth, async (req, res) => {
    body = req.body
    f_id = body.f_id
    console.log(f_id,'f_id')
    u_id = body.u_id
    fight_number = body.fight_number
    console.log(fight_number,'fight_number')

  const bets_wala = await Betting_wala.find({fight_id : f_id})
  console.log(bets_wala,'bets_wala')
  const bets_meron = await Betting_meron.find({fight_id : f_id})
  console.log(bets_meron,'bets_meron')
  const bets_draw = await Betting_draw.find({fight_id : f_id})
  console.log(bets_draw,'bets_draw')

    function totalSum(bets_type){
        var total = 0;
        bets_type.forEach(data => {

          total += data.amount 
        });
        return total
    }

    const total_wala = totalSum(bets_wala)
    console.log(total_wala,'total_wala')
    const total_meron = totalSum(bets_meron)
    console.log(total_meron,'total_meron')
    const total_draw = totalSum(bets_draw)
    console.log(total_draw,'total_draw')

    function calculateTaya(m,w,d,winner){
        // var c = ((w * .9 ) /m ) +1 ;
        // var d = ((m * .9 ) /w ) +1 ;
        var c = ((m + w) *.95) / m 
        var d = ((m + w) *.95) / w 
        
        let share = 0 
        if(winner === 'meron') {
            console.log(c)
           share = c * 100
            return { 'share_meron' : share  } 
             }else if(winner === 'wala') {
                console.log(d)
                share = d * 100
                return { 'share_wala' : share  } 
             } else {
                share = 1
                return { 'share_draw' : 8  } 
             }
    
        }

        const payout_meron = calculateTaya(total_meron,total_wala,total_draw, 'meron')
        console.log(payout_meron,'payout_meron')
        const payout_wala = calculateTaya(total_meron,total_wala,total_draw, 'wala')
        console.log(payout_wala,'payout_wala')
        const payout_draw = calculateTaya(total_meron,total_wala,total_draw, 'draw')
        console.log(payout_draw,'payout_draw')

        let ts = Math.round(Date.now() / 1000);
const total_bet = total_meron + total_wala ;
        
        const total = new Total({
            u_id,
            f_id,
            fight_number,
            "total_bet":total_bet,
            "total_bet_meron":total_meron,
            "total_bet_wala":total_wala,
            "total_bet_draw":total_draw,
            "date": ts,
            "date_string": new Date(ts * 1000)
        })
        console.log('total',total)

        await total.save()
       




   
    try {
        let success_response = ({ message: "Success",  status: true , data: {total_wala,total_meron,total_draw , payout_meron , payout_wala , payout_draw}})
        res.status(201).send(success_response)
    }

    catch(error){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }

})



// router.post('/total_bets', auth, async (req, res) => {
//     let ts = Math.round(Date.now() / 1000);
//     let body = req.body
//     const total = new Total({
//         "u_id" : body.u_id,
//         "f_id" : body.f_id,
//         "fight_number" : body.fight_number,
//         "total_bet":body.total_bet,
//         "total_bet_meron":body.total_bet_meron,
//         "total_bet_wala":body.total_bet_wala,
//         "total_bet_draw":body.total_bet_draw,
//         "winner":body.winner,
//         "date": ts,
//         "date_string": new Date(ts * 1000)
//     })
//     try {
//         await total.save()
//         let success_response = ({ message: "success",  status: true , data: {total}})
//         res.status(201).send(success_response)
//     } catch (e) {
//         let err_response = ({ message : { error : "this only trigger once"} ,status: false, data : ""} )
//         res.status(200).send(err_response)
//         // res.status(400).send(e)

//     }
//     })


    router.get('/total_bet_list', auth, async (req, res) => {
        let lim = parseInt(req.query.limit) 
        let page = parseInt(req.query.page)
        let pg = (lim * page) - lim
        let u_id = req.query.u_id
        let f_id = req.query.f_id
    
        console.log(req.query.f_id)
        if (!req.query.f_id){
            req.query.f_id = ""
         }
    
    
        if (req.query.f_id !== ""){ 
            console.log("f_id != null")
    
                        let total = await Total.find({f_id})
    
                    try{
                        
                    
                        let success_response = ({ message: "found",  status: true , data: {total}})
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
           const result = await  Total.find({ 
    
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