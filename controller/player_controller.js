const player = require('../model/player_model');
const coach = require('../model/coach_model');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
//add 
module.exports.add_player = async (req, res) => {
    try {
        let email = await player.findOne({ email: req.body.email })
        if (email) {
            return res.json({ status: 400, msg: 'email is already excited' });
        } else {
            req.body.role = 'player';
            let i = ''
            if (req.file) {
                i = player.upPath + '/' + req.file.filename;
            }
            let pass = await bcrypt.hash(req.body.password, 10);
            req.body.password = pass;
            req.body.image = i;

            let player_add = await player.create(req.body);

            let coach_data = await coach.findById(req.body.coach_id);
            coach_data.player_ids.push(player_add.id);

            let update = await coach.findByIdAndUpdate(coach_data.id, ({ player_ids: coach_data.player_ids }));
            if (update) {
                return res.json({ status: 200, msg: 'player added successfully' });
            } else {
                return res.json({ status: 500, msg: 'some thing wrong' });
            }
        }
    } catch (err) {
        console.log('add player err: ', err);
    }
}
//login player
module.exports.login_player = async (req, res) => {
    try {
        let email = await player.findOne({ email: req.body.email });
        if (email) {
            if (await bcrypt.compare(req.body.password, email.password)) {
                let token = jwt.sign({ data: email }, 'player', { expiresIn: 890000 });
                return res.json({ status: 200, token: token });
            } else {
                return res.json({ status: 400, msg: 'invalid password' });
            }
        } else {
            return res.json({ status: 400, msg: 'invalid email' });
        }
    } catch (err) {
        console.log('login err in player', err);
    }
}

//change Password
module.exports.change_password_player = async (req, res) => {
    try {
        let data = await player.findOne({ email: req.user.email });
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                if (req.body.password != req.body.newPassword) {
                    if (req.body.newPassword == req.body.conPassword) {
                        let pass = await bcrypt.hash(req.body.newPassword, 10);
                        let change = await player.findByIdAndUpdate(req.user.id, ({ password: pass }));
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

//profile
module.exports.profile = async (req, res) => {
    try {
        let data = await player.findById(req.user.id).populate('coach_id').exec();
        return res.json({ status: 200, profile: data });
    } catch (err) {
        console.log('profile err in player', err);
    }
}

//update 
module.exports.update_player = async (req, res) => {
    try {
        let data = await player.findById(req.body.eid);
        if (data) {
            if (req.file) {
                let di = path.join(__dirname, '..', data.image);
                fs.unlink(di);

                req.body.image = player.upPath + '/' + req.file.filename;

                let update = await player.findByIdAndUpdate(req.body.eid, req.body);
                if (update) {
                    return res.json({ status: 200, msg: 'player updated successfully ', player: update });
                } else {
                    return res.json({ status: 500, msg: 'some thing wrong', });
                }
            } else {
                req.body.image = data.image;
                let update = await player.findByIdAndUpdate(req.body.eid, req.body);
                if (update) {
                    return res.json({ status: 200, msg: 'player updated successfully '});
                } else {
                    return res.json({ status: 500, msg: 'some thing wrong', });
                }
            }
        } else {
            return res.json({ status: 500, msg: 'some thing wrong', });

        }
    } catch (err) {
        console.log('update err in player ', err);
    }
}