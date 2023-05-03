const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const Authenticate = require("../middleware/Authenticate");

router.post("/Signup",userControllers.postUser);

router.post("/Login",userControllers.loginUser);

router.get("/ispremium",Authenticate.Authenticate,userControllers.ispremiumUser);

module.exports = router