const express = require('express');
const loginController = require('../../controllers/loginController');
const router = express.Router();

// [GET] /login
router.post("/",(req,res)=>{
    loginController.login(req,res);
})

module.exports = router