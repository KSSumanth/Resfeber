const { model } = require("mongoose");
const list=require("../models/schema.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { accessToken } = require("mapbox-gl");
const { query } = require("express");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allist = await list.find({});
    res.render("listing/allist.ejs", { allist });
  }
  module.exports.renderNewForm=(req, res) => {
    res.render("listing/new.ejs");
  }
  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let details = await list.findById(id).populate({path:"reviews",
      populate:{
        path:"author"
      },
    }).populate("owner");
    // console.log(details);
    if(!details){
      req.flash("error","places you searching for doesnot exist");
      res.redirect("/listings");
    }
    res.render("listing/detail.ejs", { details });
  }
  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let details = await list.findById(id);
    let originalUrl=details.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/h_250,w_300");
    if(!details){
      req.flash("error","places you searching for doesnot exist");
      res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { details,originalUrl});
  }
  module.exports.addEditForm=async (req, res) => {
    // if (!req.body.details) {
    //   throw new expresserror(400, "insufficeint information");
    // }
    let { id } = req.params;
    // let listing= await list.findById(id);
    let listing=await list.findByIdAndUpdate(id, { ...req.body.details });
    if(typeof req.file !="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    res.redirect(`/listings/${id}`);
  }
  module.exports.addNewListing=async (req, res, next) => {
    let response=await geocodingClient.forwardGeocode({
      query:req.body.details.location,
      limit:1,
    }).send();
    let url=req.file.path;
    let filename=req.file.filename;
    const l = new list(req.body.details);
    l.owner=req.user._id;//adding owner when he loged in before he creating the listings
    l.image={url,filename};
    l.geometry=response.body.features[0].geometry;
    let newlist= await  l.save();
    console.log(newlist);
    req.flash("success", "list added successfuly");
    res.redirect("/listings");
  }
  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await list.findByIdAndDelete(id);
    req.flash("success", "list is deleted");
    res.redirect("/listings");
  }