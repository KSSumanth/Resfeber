const mongoose=require("mongoose");
const list = require("../models/schema.js");
const datalist=require("./initial.js");
main().then(() => {
    console.log("connection succesful");
  }
  )
  .catch((err) => {
    console.log(err);
  }
  )
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Resfeber');
  }
  async function init(){
    await list.deleteMany({});
    datalist.data=datalist.data.map((obj) =>({...obj,owner:"66589679f0e33a6ce4c8db9a"}));
    await list.insertMany(datalist.data);
  }
  init();