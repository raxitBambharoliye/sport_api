 const mongoose= require('mongoose');
 const multer=require('multer');
 const path=require('path');
 const uploadPath='/upload/player';

 const schema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    coach_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'coach',
        require:true,
    },
    role:{
        type:String,
        required:true
    }

 })

 const imgObj=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',uploadPath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
 })
 schema.statics.upImg=multer({storage:imgObj}).single('image');
 schema.statics.upPath=uploadPath;
 const player=mongoose.model('player',schema);
 module.exports=player;