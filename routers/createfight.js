const express = require('express')
const Fight = require('../models/createfight')
const multer = require('multer')
const auth = require('../middleware/auth')
const Csv = require('../models/csv')
const router = new express.Router()
const fs = require('fs'); 
const parse = require('csv-parse'); 


const csv = multer({
    dest: "csv",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(csv|excel)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})



router.post('/csv', auth, csv.single('csv'), async (req, res) => {
    let body = req.body
    req.user.csv = req.file.buffer
    console.log('file' ,req.file)
    const csv_save =  new Csv({
        "u_id":body.u_id,
        "file_name": req.file.filename
    })
 

    var csvData=[];

    let n = 0;
    let petsa = "";
    let pamagat = "";

    fs.createReadStream("csv/"+req.file.filename)
        .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {
            console.log(csvrow);
            n++;

            if(n == 0){ petsa = csvrow[0]}
            else if(n ==1 ){ pamagat = csvrow[0]}
            else if(n ==2){}
            else{


                            //do something with csvrow
                            let ts = Math.round(Date.now() / 1000);
                        const fight = new Fight({
                        "u_id" : body.u_id,
                        "fight_number":csvrow[0],
                        "meron_breeder":csvrow[1],
                        "meron_desc":csvrow[2],
                        "meron_weight":csvrow[3],   
                        "date_of_fight":petsa,
                        "title":pamagat,
                        "wala_breeder":csvrow[4],
                        "wala_desc":csvrow[5],
                        "wala_weight":csvrow[6],
                        "status":'pending',
                        "date": ts,
                        "date_string": new Date(ts * 1000)
                    })
                    fight.save()
            }
            csvData.push(csvrow);        
        })
        .on('end',function() {
          //do something with csvData
        //   console.log(csvData);
        });


    await csv_save.save()
    let success_response = ({ message: "found",  status: true , data: {csv_save } })
        res.status(200).send(success_response)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})







router.post('/fight', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const fight = new Fight({
        "u_id" : body.u_id,
        "fight_number":body.fight_number,
        "title":body.title,
        "meron_breeder":body.meron_breeder,
        "meron_desc":body.meron_desc,
        "meron_weight":body.meron_weight,   
        "date_of_fight":body.date_of_fight,
        "wala_breeder":body.wala_breeder,
        "wala_desc":body.wala_desc,
        "wala_weight":body.wala_weight,
        "winner":body.winner,
        "winner_name":body.winner_name,
        "status":body.status,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await fight.save()
        let success_response = ({ message: "success",  status_created: true , data: {fight}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field or the fight number has been taken"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
        // res.status(400).send(e)
    }
    })


    


    router.get('/fight_list_all', auth, async (req, res) => {
        let lim = parseInt(req.query.limit) 
        let page = parseInt(req.query.page)
        let pg = (lim * page) - lim
        let u_id = req.query.u_id
        let status = req.query.status

        console.log(req.query.status)
        if (!req.query.status ){
            req.query.status = ""
         }


        if (req.query.status !== ""){ 
            // console.log("f_id != null")

                        let fight = await Fight.find({status})

                    try{
                        
                    
                        let success_response = ({ message: "found",  status: true , data: {fight}})
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
           const result = await  Fight.find({ 
    
            }).skip(pg).sort(sorter).limit(lim).exec()
           
            let success_response = ({ message: "found",  status: true , data: {result}})
            res.status(200).send(success_response)
        } catch (e){
            let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
            res.status(200).send(err_response)  
        }

    }
    })
    

router.post('/fight_update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status','winner']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const fight = await Fight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!fight) {
            return res.status(404).send()
        }

        res.send(fight)
    } catch (e) {
        res.status(400).send(e)
    }
})




module.exports = router