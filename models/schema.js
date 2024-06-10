const { count } = require("console");
const mongoose=require("mongoose");
const { model } = require("mongoose");
const { describe } = require("node:test");
const { type } = require("os");
const reviews = require("./reviews.js");

const placeList=mongoose.Schema({
title:{
    type:String,
    required:true,
},
description:{
    type:String
},
image:{
url:String,
filename:String,
},
price:{
    type:Number,
},
location:{
    type:String,
},
country:{
type:String,
},
reviews:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }
],
geometry:{
    type: {
        type: String, // Don't do `{ geometry: { type: String } }`
        enum: ['Point'], // 'geometry.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}
});
placeList.post("findOneAndDelete",async (list)=>{
if(list){
await reviews.deleteMany({_id:{$in : list.reviews}});
}
}
 )
const list=mongoose.model("list",placeList);
module.exports=list;