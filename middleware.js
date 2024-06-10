// const user = require("./models/user");
const Listing = require("./models/schema");
const Review=require("./models/reviews.js");
const expresserror = require("./utils/expresserror.js");
const { listingSchema } = require("./schema.js");
const { model } = require("mongoose");
const {reviewSchema}=require("./schema.js");
// const User=require("./models/user.js");
module.exports.isLogedIn=(req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl= req.originalUrl;   
            // console.log(User);
    req.flash("error","please login to your account to create your listing");
    return res.redirect("/login");
  }
  next();
}
module.exports.checkLogin=(req,res,next) => {
    if(req.session.redirectUrl){
  res.locals.redirectLink=req.session.redirectUrl;//here i am saving to locals because when login rout is proccessed through post request the redirectUrl will be erased so intially i am saving to locals
    }
    next();
}
module.exports.isOwner=async (req,res,next)=> {
  let {id}=req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner of this list");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.listinghandler = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg=error.details.map((el) => el.message
    ).join(",");
    throw new expresserror(404, error);
  }
  else {
    next();
  }
}
module.exports.reviewhandler=(req,res,next) => {
  let {error}=reviewSchema.validate(req.body);
  if(error){
    throw new expresserror(404,error);
  }
  else{
    next();
  }
}
module.exports.isreviewAuthor=async (req,res,next)=> {
  let {id,reviewId}=req.params;
  let review= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
