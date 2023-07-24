const express=require('express');
const router=express.Router();
const controller=require('../controller/player_controller');
const model=require('../model/player_model');
const passport=require('passport');
//add
router.post('/add_player',passport.authenticate('coach',({failureRedirect:'/login_fail'})),model.upImg,controller.add_player);
router.post('/login_player',controller.login_player);
router.post('/change_password_player',passport.authenticate('player',({failureRedirect:'/login_fail'})),controller.change_password_player);
router.get('/profile',passport.authenticate('player',({failureRedirect:'/login_fail'})),controller.profile);

router.put('/update_player',model.upImg,passport.authenticate('player',({failureRedirect:'/login_fail'})),controller.update_player);
module.exports=router;