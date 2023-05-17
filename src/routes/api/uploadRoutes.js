const express = require('express');
const uploadController = require('../../controllers/uploadController');
const router = express.Router();

// [GET] /upload
router.put("/", (req, res) => {
    uploadController.uploadImage(rer, res);
})

module.exports = router