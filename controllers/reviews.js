const list=require("../models/schema");
const Review=require("../models/reviews");
module.exports.writeReview=async (req,res) => {
    let listing=await list.findById(req.params.id);
    let newreview= new Review(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }
  module.exports.deleteReview=async (req,res) => {
    let {id,reviewId}=req.params;
    await list.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }