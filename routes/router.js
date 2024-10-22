const express = require("express");
const router = express.Router();
const {auth,isUser,isAdmin,isCompany } = require("../middlewares/auth")
const {createFormEntry}=require("../controllers/Auth")

// router.post("/signup",Signup);
// router.post("/sendotp",SendOTP);
// router.post("/login",login);

router.post('/forms', createFormEntry);



module.exports= router;