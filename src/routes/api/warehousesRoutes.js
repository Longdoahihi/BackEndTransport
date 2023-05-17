const express = require('express');
const warehouseController = require('../../controllers/warehouseController');
const router = express.Router();
// [GET] warehouses
router.get("/:id",(req,res)=>{
    warehouseController.getWareHouseByID(req,res);
})
// [GET] warehouses
router.get("/",(req,res)=>{
    warehouseController.getWareHouses(req,res);
})
// [PUT] warehouse
router.post("/",(req,res)=>{
    warehouseController.createWarehouse(req,res);
})

module.exports = router