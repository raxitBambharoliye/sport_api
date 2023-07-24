const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy
const jwtExtract = require('passport-jwt').ExtractJwt;
const coach = require('../model/coach_model');
const player = require('../model/player_model');
const opts = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'coach'
}
const opts_player = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'player'
}

passport.use('coach', new jwtStrategy(opts, async (user, done) => {
    let data = await coach.findOne({ email: user.data.email });
    if (data) {
        if (user.data.password == data.password) {
            done(null, data);
        } else {
            done(null, false);
        }
    } else {
        done(null, false);
    }
}));
passport.use('player', new jwtStrategy(opts_player, async (user, done) => {
    let data = await player.findOne({ email: user.data.email });
    if (data) {
        if (user.data.password == data.password) {
            done(null, data);
        } else {
            done(null, false);
        }
    } else {
        done(null, false);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    let data = await coach.findById(id);
    let data_player = await player.findById(id);

    if (data) {
        done(null, data);
    } else {
        if (data_player) {
            done(null, data_player);
        } else {
            done(null, false);
        }
    }
})

passport.setAuthenticateUser = (req, res, next) => {
    if (req.user.role == 'coach') {
        res.locals.coach = req.user;
    } else {
        res.locals.player = req.user;
    }
}

module.exports = passport;