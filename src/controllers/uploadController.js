const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
// Khởi tạo DynamoDB client
const {dynamoClient} = require('../config/db')
// Khởi tạo Express app
const app = express();
// Cấu hình Multer để xử lý upload file
const upload = multer({ dest: 'uploads/' });
class uploadController {
    uploadImage(req, res) {
        const customerEmail = req.params;
        const photoUrl = req.file.path;
        // Cập nhật thông tin người dùng trong DynamoDB
        dynamoClient.update({
            TableName: 'Customer',
            Key: { customerEmail: customerEmail },
            UpdateExpression: 'SET photoUrl = :photoUrl',
            ExpressionAttributeValues: {
                ':photoUrl': photoUrl,
            },
        }, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json({ success: true });
            }
        });
    }
}

module.exports = new uploadController; 