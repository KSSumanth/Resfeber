const User=require("../models/user")
module.exports.renderSignUpForm=(req,res) => {
    res.render("users/signUp.ejs");
  }
  module.exports.doSignUp=async (req,res) => {
    try{
    let{email,username,password}=req.body;
    let newuser=User({email,username});
    let registerdUser=await User.register(newuser,password);
    req.login(registerdUser,(err) => {
      if(err){
        return next(err);
      }
      console.log(registerdUser);
    req.flash("success","You have been succesfuly registered");
    res.redirect("/listings");
    }
    )
    }
    catch(err){
      req.flash("error",err.message);
      res.redirect("/signup");
    }
  }
  module.exports.renderLoginForm=(req,res) => {
    res.render("users/login.ejs");
  }
  module.exports.doLogin=async (req,res) => {  //if failure happens then redirect to login page only and flash a message
    req.flash("success","welcome back to your account");
    let link= res.locals.redirectLink || "/listings";    //see here i am using locals variable to access the visited path when i logined throw that path 
    res.redirect(link);
  }
  module.exports.doLogout=(req,res,next) => {
    req.logout((err) => {
      if(err){
        return next(err);
      }
      req.flash("success","your are loged out");
      res.redirect("/listings");
    }
  )
  }