const mongoose= require('mongoose');

const schema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    player_ids:{
        type:Array,
        ref:'player',
        required:true
    }
});

const coach=new mongoose.model('coach',schema);
module.exports=coach;