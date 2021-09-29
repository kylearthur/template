const express = require('express')
const Coinsin = require('../models/cashin')
const Coins = require('../models/cash')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/send/cash', auth, async (req, res) => {
    let body = req.body
    let u_id = body.u_id
    let value = body.amount
    let reciever_uid = body.reciever_uid
    let attended_by = body.email
    let user_id = body.u_id
    console.log(res.body)


    const c = await Coins.findOne({u_id:user_id})
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




    const c2 = await Coins.findOneAndUpdate({u_id},  
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

    const c3 = await Coins.findOne({u_id : reciever_uid})
    
    let total2 = c3.amount + value;

    const c4 = await Coins.findOneAndUpdate({u_id : reciever_uid},  
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



    
    

    //  const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        "amount":body.amount,
        "u_date_cashin":ts,
         "u_id":body.reciever_uid,
          attended_by,
          "email":body.email,
          "mobile_number":body.mobile_number,
         "date_attended":ts,
         "date_attended_string":new Date(ts * 1000),
        "u_date_cashin_string": new Date(ts * 1000)
    }

 const coinsin = new Coinsin(info)

 
    try {
        await coinsin.save()
        let success_response = ({ message: "success",  status: true , data: {coinsin}})
        res.status(201).send(success_response)
        // res.status(400).send(e)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
        // res.status(400).send(e)
    }
})




router.post('/send_user_name', auth, async (req, res) => {

    let  body = req.body
  let  u_id = body.u_id
  let  user_name = body.user_name
  let  s_user_name = body.u_user_name
  let  r_user_name = body.r_user_name



  let may_name = await Coins.findOne({user_name : r_user_name})
  console.log("name",may_name)

  if(may_name === null){

    let err_response = ({ message : { error : "no user"} ,status: false,   data : ""})
res.status(200).send(err_response)
    return
}


   let value = body.amount
    let attended_by = body.email

    const c = await Coins.findOne({user_name : s_user_name})
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


    const c2 = await Coins.findOneAndUpdate({user_name : s_user_name },  
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

    const c3 = await Coins.findOne({user_name : r_user_name})

    let total2 = c3.amount + value;


    const c4 = await Coins.findOneAndUpdate({user_name : r_user_name},  
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

 const coinsin = new Coinsin(info)
    try {
        await coinsin.save()
        let success_response = ({ message: "success",  status: true , data: {coinsin}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })



    router.post('/send_email', auth, async (req, res) => {

        let  body = req.body
      let  u_id = body.u_id
      let  email = body.email
      let  s_email = body.u_email
      let  r_email = body.r_email


      let may_email = await Coins.findOne({email : r_email})
      console.log("name",may_email)
    
      if(may_email === null){
    
        let err_response = ({ message : { error : "no user"} ,status: false,   data : ""})
    res.status(200).send(err_response)
        return
    }
    
       let value = body.amount
        let attended_by = body.email
    
        const c = await Coins.findOne({email : s_email})
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
    
    
        const c2 = await Coins.findOneAndUpdate({email : s_email },  
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
    
        const c3 = await Coins.findOne({email : r_email})
    
        let total2 = c3.amount + value;
    
    
        const c4 = await Coins.findOneAndUpdate({email : r_email},  
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
    
     const coinsin = new Coinsin(info)
        try {
            await coinsin.save()
            let success_response = ({ message: "success",  status: true , data: {coinsin}})
            res.status(201).send(success_response)
        } catch (e) {
            let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
            res.status(200).send(err_response)  
        }
        })



        router.post('/send_number', auth, async (req, res) => {

            let  body = req.body
          let  u_id = body.u_id
          let  mobile_number = body.mobile_number
          let  s_mobile_number = body.u_mobile_number
          let  r_mobile_number = body.r_mobile_number

          let may_number = await Coins.findOne({mobile_number : r_mobile_number})
          console.log("name",may_number)
        
          if(may_number === null){
        
            let err_response = ({ message : { error : "no user"} ,status: false,   data : ""})
        res.status(200).send(err_response)
            return
        }
        
           let value = body.amount
            let attended_by = body.email
        
            const c = await Coins.findOne({mobile_number : s_mobile_number})
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
        
        
            const c2 = await Coins.findOneAndUpdate({mobile_number : s_mobile_number},  
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
        
            const c3 = await Coins.findOne({mobile_number : r_mobile_number})
        
            let total2 = c3.amount + value;
        
        
            const c4 = await Coins.findOneAndUpdate({mobile_number : r_mobile_number},  
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
        
         const coinsin = new Coinsin(info)
            try {
                await coinsin.save()
                let success_response = ({ message: "success",  status: true , data: {coinsin}})
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

    const c = await Coins.findOne({u_id})
    console.log(c)

    let total = c.amount + value; 


    const c2 = await Coins.findOneAndUpdate({u_id},  
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

 const coinsin = new Coinsin(info)
    try {
        await coinsin.save()
        let success_response = ({ message: "success",  status: true , data: {coinsin}})
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

    const c = await Coins.findOne({u_id})
    console.log(c)

    let total = c.amount + value; 


    const c2 = await Coins.findOneAndUpdate({u_id},  
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

 const coinsin = new Coinsin(info)
    try {
        await coinsin.save()
        let success_response = ({ message: "success",  status: true , data: {coinsin}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })
    



    router.post('/cashin_v2', auth, async (req, res) => {

        body = req.body
        u_id = body.u_id
        value = body.amount
    
        const c = await Coins.findOne({u_id})
        console.log(c)
    
        let total = c.amount + value; 
    
    
        const c2 = await Coins.findOneAndUpdate({u_id},  
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
             "user_name":body.user_name,
             "my_master_agent_email":body.my_master_agent_email,
             "my_agent_email":body.my_agent_email,
             "gcash":body.gcash,
             "email":body.email,
             "attended_by":body.attended_by,
             "mobile_number":body.mobile_number,
             "date_attended":ts,
             "date_attended_string":new Date(ts * 1000),
            "u_date_cashin_string": new Date(ts * 1000)
        }
    
     const coinsin = new Coinsin(info)
        try {
            await coinsin.save()
            let success_response = ({ message: "success",  status: true , data: {coinsin}})
            res.status(201).send(success_response)
        } catch (e) {
            let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
            res.status(200).send(err_response)  
        }
        })



        router.get('/cashin_list_for_master', auth, async (req, res) => {
            let lim = parseInt(req.query.limit) 
            let page = parseInt(req.query.page)
            let pg = (lim * page) - lim
            let u_id = req.query.u_id
            let status = req.query.status
            let my_master_agent_email = req.query.my_master_agent_email
            let my_agent_email = req.query.my_agent_email
        
            console.log(req.query.my_master_agent_email)
            if (!req.query.my_master_agent_email ){
                req.query.my_master_agent_email = ""
             }
        
        
            if (req.query.my_master_agent_email!== ""){ 
                // console.log("f_id != null")
        
                            let coinsin = await Coinsin.find({my_master_agent_email })
        
                        try{
                            
                        
                            let success_response = ({ message: "found",  status: true , data: {coinsin}})
                            res.status(200).send(success_response)
                        } catch (e) {
                            let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                            res.status(200).send(err_response)  
                        }
        
        
        
            } else {
        
                // console.log("f_id == null")
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
               const result = await  Coinsin.find({ 
        
                }).skip(pg).sort(sorter).limit(lim).exec()
               
                let success_response = ({ message: "found",  status: true , data: {result}})
                res.status(200).send(success_response)
            } catch (e){
                let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                res.status(200).send(err_response)  
            }
        
        }
        })


        router.get('/cashin_list_for_agent', auth, async (req, res) => {
            let lim = parseInt(req.query.limit) 
            let page = parseInt(req.query.page)
            let pg = (lim * page) - lim
            let u_id = req.query.u_id
            let status = req.query.status
            let my_master_agent_email = req.query.my_master_agent_email
            let my_agent_email = req.query.my_agent_email
        
            console.log(req.query.my_agent_email)
            if (!req.query.my_agent_email ){
                req.query.my_agent_email = ""
             }
        
        
            if (req.query.my_agent_email!== ""){ 
                // console.log("f_id != null")
        
                            let coinsin = await Coinsin.find({my_agent_email })
        
                        try{
                            
                        
                            let success_response = ({ message: "found",  status: true , data: {coinsin}})
                            res.status(200).send(success_response)
                        } catch (e) {
                            let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                            res.status(200).send(err_response)  
                        }
        
        
        
            } else {
        
                // console.log("f_id == null")
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
               const result = await  Coinsin.find({ 
        
                }).skip(pg).sort(sorter).limit(lim).exec()
               
                let success_response = ({ message: "found",  status: true , data: {result}})
                res.status(200).send(success_response)
            } catch (e){
                let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                res.status(200).send(err_response)  
            }
        
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


router.get('/cashin_list_admin', async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
  
    let srt = parseInt(req.query.sort)
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "u_date_cashin"){
        sorter = {'u_date_cashin': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Coinsin.find({  

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})


module.exports = router