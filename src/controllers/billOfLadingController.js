const { dynamoClient } = require("../config/db");
const { v4: uuidv4 } = require('uuid');
class BillOfLadingsController {
    getBillOfLadings(req, res) {
        // Lấy các tham số truy vấn từ URL
        const { billOfLadingStatus } = req.query;


        // Tạo DynamoDB scan params object với biểu thức filter và attribute names/values đã tạo
        const params = {
            TableName: 'BillOfLading',
            FilterExpression: "#blStatus = :val",
            ExpressionAttributeNames: {
                "#blStatus": "billOfLadingStatus"
            },
            ExpressionAttributeValues: {
                ":val": 0
            },
        };
        console.log(params)
        // Thực hiện scan bảng DynamoDB với các params đã tạo
        dynamoClient.scan(params, (err, data) => {
            if (err) {
                console.error('Lỗi khi scan bảng DynamoDB: ', err);
                res.send({
                    code: 500,
                    message: 'Lỗi khi lấy dữ liệu từ bảng DynamoDB',
                    error: err
                });
            } else {
                res.send({
                    code: 200,
                    data: data.Items
                });
            }
        });
    }
    getBillOfLadingByID(req, res) {
        const id = req.params.id;
        // Tạo params object để truy vấn dữ liệu từ DynamoDB
        const params = {
            TableName: 'BillOfLading',
            Key: { "billOfLadingID": id }
        };

        // Gọi phương thức get() của DocumentClient để lấy bài viết từ DynamoDB
        dynamoClient.get(params, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    code: 500,
                    message: err
                });
            } else if (!data.Item) {
                res.status(404).json({
                    code: 400,
                    message: 'Không tìm thấy vận đơn!'
                });
            } else {
                res.json({
                    code: 200,
                    data: data?.Item ?? {}
                });
            }
        });
    }
    createBillOfLadings(req, res) {
        console.log(req.body)
        // return;
        const body = req.body;
        const params = {
            TableName: "BillOfLading",
            Item: {
                ...body,
                billOfLadingID: uuidv4(),
            }
        }
        dynamoClient.put(params, (err, data) => {
            if (err)
                res.send({
                    code: 500,
                    message: "Thêm mới vận đơn thất bại! Lỗi: " + err
                })
            else
                res.send({
                    code: 200,
                    message: "Thêm mới vận đơn thành công!"
                })
        })
    }
}
module.exports = new BillOfLadingsController;