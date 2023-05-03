const express = require("express");
const router = express.Router();

const passwordControllers = require("../controllers/passwordControllers");

router.post("/forgotpassword",passwordControllers.forgotPassword);
router.get("/resetPassword/:id",passwordControllers.resetPassword)
router.post("/changePassword",passwordControllers.changePassword);


module.exports = router;