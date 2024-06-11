const express=require("express");
const { route } = require("./listing");
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { checkLogin } = require("../middleware.js");
const router=express.Router();
const userController=require("../controllers/users.js");
router.route("/user/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.doSignUp));
router.route("/user/login")
.get(userController.renderLoginForm)
.post(checkLogin,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.doLogin);
router.get("/user/logout",userController.doLogout);
module.exports=router;
// router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true, successRedirect: '/listings'})
// )  //if failure happens then redirect to login page only and flash a message
// req.flash("success","welcome back to your account");