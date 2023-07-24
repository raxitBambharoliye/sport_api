const mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1/node_api_pr_2');
const db=mongoose.connection;
db.once('open',(err)=>{
    if(err){
        console.log('dv not connected !!!');
        return false;
    }
    console.log('dv is  connected ');
})

module.exports=db;