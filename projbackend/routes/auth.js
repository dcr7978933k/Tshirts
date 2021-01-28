var express = require('express')
var router = express.Router()
const { check, validationResult } = require('express-validator');
 
const {signin,signout,signup,isSignedIn}=require("../controllers/auth");

router.post("/signup",[
    check('name','name should be min 3 char')
    .isLength({ min: 3 }),
    check('email','email should be a valid one')
    .isEmail(),
    check('password','password should be min 3 char')
    .isLength({ min: 3 }),

],signup)
router.post("/signin",[
    
    check('email','email should be a valid one')
    .isEmail(),
    check('password','password is required')
    .isLength({ min: 1 }),

],signin)



router.get("/signout",signout);

router.get("/testroute",isSignedIn,(req,res)=>{
    res.send("A protected route");
});

module.exports = router;