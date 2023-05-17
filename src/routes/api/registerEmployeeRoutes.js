const express = require('express');
const employeeRegisterController = require('../../controllers/employeeRegisterController');
const router = express.Router();
// [POST] /register
router.post("/",(req,res)=>{
    employeeRegisterController.register(req,res)
})

module.exports = router