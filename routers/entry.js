const express = require('express')
const Entry = require('../models/entry')

const auth = require('../middleware/auth')
const Fight = require('../models/createfight')
const router = new express.Router()


router.post('/entry', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
 
  

    const entry = new Entry({
        "u_id" : body.u_id,
        "entry_no":body.entry_no,
        "fight_stats":"for_sched",
        "breeder":body.breeder,
        "desc":body.desc,
        "weight":body.weight,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })

   


    try {
        await entry.save()
        let success_response = ({ message: "sucess",  status: true , data: {entry}})
        res.status(200).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "invalid"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})


router.get('/entry_list', auth, async (req, res) => {
     
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

    if(sortBy == "weight"){
        sorter = {'weight': srt}
    } else{
        sorter = {}
    }


    try {
       const result1 = await Entry.find({ fight_stats : "for_sched"

        }).skip(pg).sort(sorter).limit(lim).exec()
       


        let success_response = ({ message: "found",  status: true , data: {result1}})
        res.status(200).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})





router.post('/gen_match', auth, async (req, res) => {


    const entrys = await Entry.find({fight_stats : "for_sched"})
    const entry = await Entry.findOne({ fight_stats : "for_sched" })

    let myDate = req.query.date_of_fight
       myDate = myDate.split("-"); 
       let newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
       let newDate2 = newDate / 1000

        let weight1 = entry.weight
        let breeder1 = entry.breeder

        const match_weight = (w1,w2) => {
            let diff = 0
            if(w1 > w2){
                diff = w1 - w2
            }else if(w1 < w2){
                diff = w2 - w1
            }else{
               
            }
           
            console.log('diff',diff,w1,w2)
            if(diff > .1){
                return false
            }else{
                return true
            }
        }

        function myFunc(arg) {
            
            match_it()  

          }
          
          for(let u = 0 ; u < entrys.length ; u++){
            setTimeout(myFunc, 2000 * u, 'funky');

          }
        
          const match_it = async () => {
            
                  
             let i = 0
        
            
              for(let i = 1 ; i < entrys.length ; i++){            
              
                if(entrys[0]._id !== entry._id){
                    console.log('not_same_rooster')
            if(breeder1 !== entrys[i].breeder){

            let compare_result =  match_weight(weight1,entrys[i].weight)
               console.log('match',compare_result)

                if(compare_result){
                   // found_match = false
                    let _id = entry.id
                    let id = entrys[i].id
       
                   console.log('entry._id',entry._id)
                   console.log('entrys._id',entrys[i]._id)

                 
                       let ts = Math.round(Date.now() / 1000);
                       const fight = await  new Fight({
                       "fight_number":i,
                       "meron_breeder":entry.breeder,
                       "manok1_id":entry.id,
                       "manok2_id":entrys[i].id,
                       "meron_desc":entry.desc,
                       "meron_weight":entry.weight,   
                       "date_of_fight":newDate2,
                       "wala_breeder":entrys[i].breeder,
                       "wala_desc":entrys[i].desc,
                       "wala_weight":entrys[i].weight,
                       "date_string":new Date(ts * 1000),
                       "date" :ts
                    })
                  
                    console.log('fight',fight)

                   let ready = "ready"
                   const c2 = await Entry.findOneAndUpdate({_id},  
                       {fight_stats: ready}, null, function (err, docs) { 
                       if (err){ 
                           console.log(err) 
                          // res.status(400).send()
                       } 
                       else{ 
                         //  console.log("Original Doc : ",docs)
                         //  res.send(docs)    
                       } 
                   });
       
                   _id = id
                   const c3 = await Entry.findOneAndUpdate({_id},  
                       {fight_stats: ready}, null, function (err, docs) { 
                       if (err){ 
                           console.log(err) 
                          // res.status(400).send()
                       } 
                       else{ 
                          // console.log("Original Doc : ",docs)
                         //  res.send(docs)    
                       } 
                   });
                  
                       try{

                        await fight.save()
                        // console.log('fight',fight)
                           let success_response = ({ message: "success",  status: true , data: {fight}})
                           res.status(201).send(success_response)
                           
                       }catch(e){
                          console.log('err',e)
                           if(i == (entrys.length -1)  ) {
                               let err_response = ({ message : { error : "error"} ,status: false, data : {e}} )
                               res.status(200).send(err_response) 
                           }
                           return e
                       }
       
                       
                    }
                }
               }
            
       
            }

          }
          
          
    

})


module.exports = router