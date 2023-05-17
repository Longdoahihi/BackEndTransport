const express = require('express');
const adminLoginController = require('../../controllers/adminLoginController');
const router = express.Router();

// [GET] /login
router.post("/",(req,res)=>{
    adminLoginController.login(req,res);
})

module.exports = router