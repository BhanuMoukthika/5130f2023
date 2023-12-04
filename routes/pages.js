const express= require("express");
const router =express.Router();
const authController= require("../controllers/auth")
router.get('/',(req,res)=>{
    res.render("index");
});
router.get('/signup',(req,res)=>{
    res.render("signup");
});
router.get('/login',(req,res)=>{
    res.render("login");
});
router.get('/dashboard',authController.isLoggedIn,(req,res)=>{
    console.log("da user:",req.user);
    if(req.user){
        res.render("dashboard",{
            user:req.user
        });
    }
    else{
        res.redirect("/login");
    }
});
router.get('/workout',authController.isLoggedIn,(req,res)=>{
    console.log("w user:",req.user);
  if(req.user){
      res.render("workout",{
          user:req.user
      });
  }
  else{
      res.redirect("/login");
  }
});
router.get('/diet',authController.isLoggedIn,(req,res)=>{
    console.log("d user:",req.user);
  if(req.user){
      res.render("diet",{
          user:req.user
      });
  }
  else{
      res.redirect("/login");
  }
});
module.exports=router;
