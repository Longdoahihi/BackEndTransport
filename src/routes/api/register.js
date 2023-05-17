const express = require('express');
const router = express.Router();
const registersController = require('../../controllers/registerController');
// [POST] /register
router.post("/",(req,res)=>{
    registersController.register(req,res);
})

module.exports = router