const express = require('express');
const db=require('./config/mongoose');
const app = express();
app.use(express.urlencoded());
//passport 
const passport=require('passport');
const passport_mid=require('./config/passport-jwt');
const session=require('express-session');

app.use(session({
    name:'users',
    secret:'sport',
    saveUninitialized:true,
    resave:true,
    cookie:{
        maxAge:100*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/',require('./router/index_router'))
app.listen(8009, (err) => {
    if (err) {
        console.log("server not running ");
        return false;
    }
    console.log("server is running ");
})