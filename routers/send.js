const express = require('express')
const fetch = require('node-fetch')


const router = new express.Router()

router.post('/send-notif' , (req,res)=>{

    var notification = {
        'title':"Title notification",
        'text':"subtitle"
    }

    var fcm_tokens = []

    var notification_body = {
        'notification':notification,
        'registration_ids': fcm_tokens
    }


    fetch('https://fcm.googleapis.com/fcm/send',{
        'method':"POST",
        'headers':{
            'Authorization':'key='+
            'AAAA5ZbXWuk:APA91bFsIUYMfZSj6bYwvFFBIrRrquATl1HujhBq-vSirRqPoUyKALnc95oMSoYhxG-0tod03U0NcGf1zQVa_BPjS7HyjvZ7ChhlIBubOlv65F3DpmsKnSRogBrqPNmpCRIlBIBq1PBS',
            'Content-Type':'application/json'
        },
        'body':JSON.stringify(notification_body)
    }).then(()=>{
        res.status(200).send('notification send')
    }).catch((err)=>{
        res.status(200).send('notification not send')
        console.log(err)
    })
})




module.exports = router
