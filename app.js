if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const dbUrl=process.env.ATLASDB_URL;
const expresserror=require("./utils/expresserror.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/userroute.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport=require("passport");
const localStratergy=require("passport-local");
const User=require("./models/user.js");
main().then(() => {
  console.log("connection succesful");
}
)
  .catch((err) => {
    console.log(err);
  }
  )
async function main() { 
  await mongoose.connect(dbUrl);
}
app.use(cookieParser("sumanth@829"));
app.use(methodOverride('_method'));
app.engine('ejs', require('ejs-mate'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    screte:"mykey",
  },
  touchAfter:24*3600,    //24 hours
})
store.on("error",(err) => {
  console.log("error occured in session store",err);
}
)
app.use(session({
  store,
  secret: "mykey", resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next) => {
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
}
)

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next) => { ///works when try to access unavailabel route
  next(new expresserror(400,"page not found man"));
}
)
app.use((err,req,res,next) => {
  let{statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("listing/error.ejs",{err});
}
)
app.listen(port, () => {
  console.log(`listening to the port ${port}`);
}
)
