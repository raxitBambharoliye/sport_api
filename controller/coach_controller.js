const express = require('express')
const coach = require('../model/coach_model');
const player=require('../model/player_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');

//add coach
module.exports.add_coach = async (req, res) => {
    try {
        let email = await coach.findOne({ email: req.body.email });
        if (email) {
            return res.json({ status: 400, msg: "email is already registered " });
        } else {
            let pass = await bcrypt.hash(req.body.password, 10);
            req.body.password = pass;
            req.body.role = 'coach';
            let data = await coach.create(req.body);
            if (data) {
                return res.json({ status: 200, msg: "coach added successfully " });
            } else {
                return res.json({ status: 400, msg: "some thing is wrong !!" });
            }
        }
    } catch (err) {
        console.log('add_coach err : ', err);
    }
}

//login coach
module.exports.login_coach = async (req, res) => {
    try {
        let email = await coach.findOne({ email: req.body.email });
        if (email) {
            if (await bcrypt.compare(req.body.password, email.password)) {
                let token = jwt.sign({ data: email }, 'coach', { expiresIn: 890000 });
                return res.json({ status: 200, token: token });

            } else {
                return res.json({ status: 400, msg: "enter valid Password " });
            }
        } else {
            return res.json({ status: 400, msg: "enter valid email " });
        }
        return res.redirect('/login_user');
    } catch (err) {
        console.log('login err in coach', err);
    }
}

//profile coach
module.exports.profile_coach =async (req, res) => {
    try {
        let data=await coach.findById(req.user.id).populate('player_ids').exec();
        return res.json({ status: 200, profile: data});
    } catch (err) {
        console.log('coach profile err : ', err);
    }
}

//change Password
module.exports.change_password_coach = async (req, res) => {
    try {
        let data = await coach.findOne({ email: req.user.email });
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                if (req.body.password != req.body.newPassword) {
                    if (req.body.newPassword == req.body.conPassword) {
                        let pass = await bcrypt.hash(req.body.newPassword, 10);
                        let change = await coach.findByIdAndUpdate(req.user.id, ({ password: pass }));
                        if (change) {
                            return res.json({ status: 200, msg: "password changed successfully" });
                        }
                    } else {
                        return res.json({ status: 200, msg: "password not match password" });
                    }
                } else {
                    return res.json({ status: 200, msg: "enter difanent  password" });
                }
            } else {
                return res.json({ status: 200, msg: "enter valid password" });
            }
        } else {
            return res.json({ status: 400, msg: 'login first !!!' })
        }
    } catch (err) {
        console.log('change password err in coach : ', err);
    }
}

//all player
module.exports.all_player = async (req, res) => {
    try {
        let data=await player.find({});
        if(data){
            return res.json({status:200,msg:'all player',player:data});
        }
    } catch (err) {
        console.log('all player err in coach ', err);
    }
}