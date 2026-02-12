const express = require('express');
const authController = require("../controllers/auth.controller");



const router = express.Router();

router.post("/register", authController.userRegsterController)


module.exports = router;