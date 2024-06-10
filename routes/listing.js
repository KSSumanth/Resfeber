const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const list = require("../models/schema.js");
const {isLogedIn, isOwner,listinghandler}=require("../middleware.js");
const user=require("../models/user.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
router.route("/")
.get( wrapAsync(listingController.index))
.post(isLogedIn,upload.single('details[image]'),wrapAsync(listingController.addNewListing));
router.get("/new", isLogedIn,listingController.renderNewForm);
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isLogedIn,isOwner,upload.single('details[image]'),listinghandler,wrapAsync(listingController.addEditForm))
.delete(isLogedIn,isOwner,wrapAsync(listingController.destroyListing));
router.get("/:id/edit",isLogedIn,isOwner,wrapAsync(listingController.renderEditForm));
module.exports = router;