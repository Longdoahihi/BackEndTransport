const express = require('express');
const billOfLadingController = require('../../controllers/billOfLadingController');
const router = express.Router();

// [GET] /bill-of-ladings
router.get("/",(req,res)=>{
    billOfLadingController.getBillOfLadings(req,res)  
})
// [GET] /bill-of-ladings
router.get("/:id",(req,res)=>{
    billOfLadingController.getBillOfLadingByID(req,res)  
})
// [PUT] /bill-of-ladings/:id?billOfLadingStatus
router.put("/:id",(req,res)=>{
    billOfLadingController.updateBillOfLadings(req,res)  
})
// [POST] /bill-of-ladings
router.post("/",(req,res)=>{
    billOfLadingController.createBillOfLadings(req,res)  
})

module.exports = router