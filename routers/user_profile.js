const express = require('express')
const User_profile = require('../models/user_profile')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/user_profile',  async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const user_profile = new User_profile({
        "u_id" : body.u_id,
        "full_name" : body.full_name,
        "user_name" : body.user_name,
        "date_of_birth" : body.date_of_birth,
        "current_address" : body.current_address,  
        "nationality" : body.nationality, 
        "occupation" : body.occupation, 
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await user_profile.save()
        let success_response = ({ message: "success",  status: true , data: {user_profile}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })


router.get('/user_profile_list', auth, async (req, res) => {
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

    if(sortBy == "date"){
        sorter = {'date': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await  User_profile.find({ u_id

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})

router.post('/profile_update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['mobile_number','complete_address','bank_acc','fb']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user_profile = await User_profile.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!user_profile) {
            return res.status(404).send()
        }

        res.send(user_profile)
    } catch (e) {
        res.status(400).send(e)
    }
})




module.exports = router