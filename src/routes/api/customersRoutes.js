const express = require('express');
const customerController = require('../../controllers/customerController');
const router = express.Router();
// [GET] /list customer
router.get("/",(req,res)=>{
    customerController.getCustomers(req,res);
})

module.exports = router