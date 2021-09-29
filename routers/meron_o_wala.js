const express = require('express')
const Cash = require('../models/cash')
const auth = require('../middleware/auth')
const Fight = require('../models/createfight')
const Total = require('../models/totalbets')
const Betting_meron = require ('../models/betting_meron')
const Betting_wala = require ('../models/betting_wala')
const Betting_draw = require ('../models/betting_draw')
const User_level = require('../models/u_level')
const router = new express.Router()


router.post('/dis',auth ,async (req , res)=>{
    body = req.body
    f_id = body.f_id
    fight_number = body.fight_number
    winner = body.winner
    let fight = await Fight.findOne({_id : f_id})
    console.log(fight,'fight')
    if(fight === null) {
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""})
        res.status(200).send(err_response) 
        return
    }

    // const game_result = await Total.findOneAndUpdate({f_id,winner})
    const game_result = await Total.findOneAndUpdate({f_id},  
          
        {winner}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });

    console.log('game_result' + game_result)
   console.log("winner" + game_result.winner)
   let m = parseInt(game_result.total_bet_meron)
   let w = parseInt(game_result.total_bet_wala)
   let d = parseInt(game_result.total_bet_draw)
   function calculateTaya(m,w,d,winner){
    // var c = ((w * .9 ) /m ) +1 ;
    // var d = ((m * .9 ) /w ) +1 ;
    var c = ((m + w) *.95) / m 
    var d = ((m + w) *.95) / w 
    
    
    let share = 0 
    if(winner === 'meron') {
        console.log(c * 100)
       share = c * 100
        return { 'share' : share  } 
         }else if(winner === 'wala') {
            console.log(d * 100)
            share = d * 100
            return { 'share' : share  } 
         } else {
            share = 1
            return { 'share' : share  } 
         }

    }

    let fight_id = f_id
  const result = calculateTaya(m,w,d,winner) 
    const share = result.share
  let winner_list = ''
        if(winner === 'meron'){
            winner_list = await  Betting_meron.find({fight_id})
        }else if(winner === 'wala'){
            winner_list = await  Betting_wala.find({fight_id })
        }else{
            winner_list = await  Betting_draw.find({fight_id})
        }

    let total_winners =  winner_list.length 
    for(var i = 0 ; i < total_winners ; i++){
       let u_id = winner_list[i].u_id
       let taya = winner_list[i].amount
        let value = 0

      if(winner === 'draw'){
         value =  taya * 8
      } else {
         value =  taya * (share / 100)
      } 

        const c = await Cash.findOne({u_id})
    
        let total = c.amount + value; 
    
      
        const c2 = await Cash.findOneAndUpdate({u_id},  
          
            {amount: total}, null, function (err, docs) { 
            if (err){ 
                console.log(err) 
               // res.status(400).send()
            } 
            else{ 
                console.log("Original Doc : ",docs)
              //  res.send(docs)    
            } 
        });

        if(i == (total_winners -1)  ) {
            let success_response = ({ message: "success",  status: true , data: {winner}})
            res.status(201).send(success_response)
        }
        // console.log(i)
        // console.log(total_winners)

    } 

})



router.get('/regla_list', auth, async (req, res) => {
    let lim = parseInt(req.query.fight_number) 
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
       const result = await Total.find({   

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})



module.exports = router