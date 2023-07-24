//this is coach router  
const express= require('express');
const router=express.Router();
const controller=require('../controller/coach_controller');
const passport=require('passport');
//loin fail
router.get('/login_fail',(req,res)=>{
    return res.json({status:400,msg:"you should login for this "})
})
//coach login
router.post('/login_coach',controller.login_coach);
//add
router.post('/add_coach',controller.add_coach);
//profile 
router.get('/profile_coach',passport.authenticate('coach',{failureRedirect:'/login_fail'}),controller.profile_coach);
//change pass word
router.put('/change_password_coach',passport.authenticate('coach',{failureRedirect:'/login_fail'}),controller.change_password_coach);
//all player
router.get('/all_player',passport.authenticate('coach',{failureRedirect:'/login_fail'}),controller.all_player);

/** player router **/
router.use('/player',require('./player_router'));
module.exports=router;