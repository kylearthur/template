const express = require('express')
const Cashin = require('../models/cashin')
const Cash = require('../models/cash')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/sendcash_via_username', auth, async (req, res) => {

    let  body = req.body
  let  u_id = body.u_id
  let  user_name = body.user_name
  let  s_user_name = body.u_user_name
  let  r_user_name = body.r_user_name



  let may_name = await Cash.findOne({user_name : r_user_name})
  console.log("name",may_name)

  if(may_name === null){

    let err_response = ({ message : { error : "no user"} ,status: false,   data : ""})
res.status(200).send(err_response)
    return
}


   let value = body.amount
    let attended_by = body.email

    const c = await Cash.findOne({user_name : s_user_name})
    console.log("c",c.amount)

    if(body.amount === 0){
        let err_response = ({ message : { error : "please enter a value"} ,status: false, data : ""} )
        res.status(200).send(err_response)
        return
    }

    if(c.amount < value){
        let err_response = ({ message : { error : "insufficient balance"} ,status: false, data : ""} )
        res.status(200).send(err_response)
        return
    }

    let total = c.amount - value; 


    const c2 = await Cash.findOneAndUpdate({user_name : s_user_name },  
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

    const c3 = await Cash.findOne({user_name : r_user_name})

    let total2 = c3.amount + value;


    const c4 = await Cash.findOneAndUpdate({user_name : r_user_name},  
        {amount: total2}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });

    
    

    // const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        "amount":body.amount,
        "u_date_cashin":ts,
        u_id,
          attended_by,
          "email":body.email,
          "mobile_number":body.mobile_number,
          "user_name":body.r_user_name,
         "date_attended":ts,
         "date_attended_string":new Date(ts * 1000),
        "u_date_cashin_string": new Date(ts * 1000)
    }

 const cashin = new Cashin(info)
    try {
        await cashin.save()
        let success_response = ({ message: "success",  status: true , data: {cashin}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })



    router.post('/sendcash_via_email', auth, async (req, res) => {

        let  body = req.body
      let  u_id = body.u_id
      let  email = body.email
      let  s_email = body.u_email
      let  r_email = body.r_email


      let may_email = await Cash.findOne({email : r_email})
      console.log("name",may_email)
    
      if(may_email === null){
    
        let err_response = ({ message : { error : "no user"} ,status: false,   data : ""})
    res.status(200).send(err_response)
        return
    }
    
       let value = body.amount
        let attended_by = body.email
    
        const c = await Cash.findOne({email : s_email})
        console.log("c",c.amount)
    
        if(body.amount === 0){
            let err_response = ({ message : { error : "please enter a value"} ,status: false, data : ""} )
            res.status(200).send(err_response)
            return
        }
    
        if(c.amount < value){
            let err_response = ({ message : { error : "insufficient balance"} ,status: false, data : ""} )
            res.status(200).send(err_response)
            return
        }
    
        let total = c.amount - value; 
    
    
        const c2 = await Cash.findOneAndUpdate({email : s_email },  
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
    
        const c3 = await Cash.findOne({email : r_email})
    
        let total2 = c3.amount + value;
    
    
        const c4 = await Cash.findOneAndUpdate({email : r_email},  
            {amount: total2}, null, function (err, docs) { 
            if (err){ 
                console.log(err) 
               // res.status(400).send()
            } 
            else{ 
                console.log("Original Doc : ",docs)
              //  res.send(docs)    
            } 
        });
    
        
        
    
        // const coinsout = new Coinsout(info)
        let ts = Math.round(Date.now() / 1000);
        
        const info = {
            "amount":body.amount,
            "u_date_cashin":ts,
            u_id,
              attended_by,
              "email":body.r_email,
              "mobile_number":body.mobile_number,
             "date_attended":ts,
             "date_attended_string":new Date(ts * 1000),
            "u_date_cashin_string": new Date(ts * 1000)
        }
    
     const cashin = new Cashin(info)
        try {
            await cashin.save()
            let success_response = ({ message: "success",  status: true , data: {cashin}})
            res.status(201).send(success_response)
        } catch (e) {
            let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
            res.status(200).send(err_response)  
        }
        })



        router.post('/sendcash_via_number', auth, async (req, res) => {

            let  body = req.body
          let  u_id = body.u_id
          let  mobile_number = body.mobile_number
          let  s_mobile_number = body.u_mobile_number
          let  r_mobile_number = body.r_mobile_number

          let may_number = await Cash.findOne({mobile_number : r_mobile_number})
          console.log("name",may_number)
        
          if(may_number === null){
        
            let err_response = ({ message : { error : "no user"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
        }
        
           let value = body.amount
            let attended_by = body.email
        
            const c = await Cash.findOne({mobile_number : s_mobile_number})
            console.log("c",c.amount)
        
            if(body.amount === 0){
                let err_response = ({ message : { error : "please enter a value"} ,status: false, data : ""} )
                res.status(200).send(err_response)
                return
            }
        
            if(c.amount < value){
                let err_response = ({ message : { error : "insufficient balance"} ,status: false, data : ""} )
                res.status(200).send(err_response)
                return
            }
        
            let total = c.amount - value; 
        
        
            const c2 = await Cash.findOneAndUpdate({mobile_number : s_mobile_number},  
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
        
            const c3 = await Cash.findOne({mobile_number : r_mobile_number})
        
            let total2 = c3.amount + value;
        
        
            const c4 = await Cash.findOneAndUpdate({mobile_number : r_mobile_number},  
                {amount: total2}, null, function (err, docs) { 
                if (err){ 
                    console.log(err) 
                   // res.status(400).send()
                } 
                else{ 
                    console.log("Original Doc : ",docs)
                  //  res.send(docs)    
                } 
            });
        
            
            
        
            // const coinsout = new Coinsout(info)
            let ts = Math.round(Date.now() / 1000);
            
            const info = {
                "amount":body.amount,
                "u_date_cashin":ts,
                u_id,
                  attended_by,
                  "mobile_number":body.r_mobile_number,
                 "date_attended":ts,
                 "date_attended_string":new Date(ts * 1000),
                "u_date_cashin_string": new Date(ts * 1000)
            }
        
         const cashin = new Cashin(info)
            try {
                await cashin.save()
                let success_response = ({ message: "success",  status: true , data: {cashin}})
                res.status(201).send(success_response)
            } catch (e) {
                let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
                res.status(200).send(err_response)  
            }
            })




router.post('/cashin', auth, async (req, res) => {

    body = req.body
    u_id = body.u_id
    value = body.amount

    const c = await Cash.findOne({u_id})
    console.log(c)

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

    
    

    // const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        "amount":body.amount,
        "u_date_cashin":ts,
         u_id,
         "email":body.email,
         "attended_by":body.attended_by,
         "mobile_number":body.mobile_number,
         "date_attended":ts,
         "date_attended_string":new Date(ts * 1000),
        "u_date_cashin_string": new Date(ts * 1000)
    }

 const cashin = new Cashin(info)
    try {
        await cashin.save()
        let success_response = ({ message: "success",  status: true , data: {cashin}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })


   
router.get('/cashin_list', async (req, res) => {
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

    if(sortBy == "u_date_cashin"){
        sorter = {'u_date_cashin': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Coinsin.find({   u_id

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})





module.exports = router