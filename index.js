var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const localStrategy = require("passport-local");
const flash = require("connect-flash");
const upload = require("./multer");



passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  //console.log(req.flash("error"));
  res.render('index', {error: req.flash('error')});
});

router.get('/login', function(req, res, next) {
  //console.log(req.flash("error"));
  res.render('index', {error: req.flash('error')});
});

router.get('/register', async function(req, res, next) {
  res.render("register");
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  let user = await userModel.findOne({ 
    username: req.session.passport.user
  })
  .populate("posts")
  console.log(user);
  res.render('profile', {user});
});

router.get('/feed', isLoggedIn, async function(req, res) {
  const posts = await postModel.find().populate("user");
  //console.log(posts);
  postModel.findOne({ date: req.body.date})
  res.render('feed', { posts });
});

router.get("/userexist", function(req, res, next){
  res.render("userExists");
})

router.post("/upload", isLoggedIn, upload.single("file"), async function(req, res, next){
  
  if(!req.file){
    return res.status(404).send("no files found ");
  }
  //res.send("file Uploaded Successfully ");
  const user = await userModel.findOne({ username: req.session.passport.user });

  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");

});

router.post("/fileupload", isLoggedIn, upload.single("image"), async function(req, res, next){
  const user = await userModel.findOne({ username: req.session.passport.user });

  user.profileImage = req.file.filename

  await user.save();
  res.redirect("/profile");

});

router.post('/register', async function(req, res, next) {
  
      

  try {

    const existingUser = await userModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (existingUser) {
          //return res.status(400).json({ message: 'User already exists', warning: 'Please Enter Unique Username and Email' });
          return res.status(400).redirect('/userexist');
        }
        
    const data = new userModel({
      username: req.body.username,
      email: req.body.email,
      contact: req.body.contact
    })

    userModel.register(data, req.body.password)
    .then(function(){
      passport.authenticate("local")(req, res, function(){
        res.redirect("/profile");
      })
    });

  } catch (error) {
    console.log(error.message);
  }

});

router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",
  failureFlash: true,
}), function(req, res, next) {
  
});

router.get("/logout", function(req, res, next){

  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });

})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}



module.exports = router;