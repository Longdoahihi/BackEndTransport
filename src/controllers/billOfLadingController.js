const { dynamoClient } = require("../config/db");
const { v4: uuidv4 } = require('uuid');
class BillOfLadingsController {
    getBillOfLadings(req, res) {
        // Lấy các tham số truy vấn từ URL
        let { billOfLadingStatus } = req.query;
        billOfLadingStatus = JSON.parse(billOfLadingStatus);
        if (!Array.isArray(billOfLadingStatus)) {
            res.send({
                code: 400,
                message: "billOfLadingStatus phải là 1 mảng",
                billOfLadingStatus: JSON.parse(billOfLadingStatus)
            })
            return;
        }

        const filterExpresstion = billOfLadingStatus.map(item => `:val${item}`);
        let expressValue = {};
        billOfLadingStatus.map(item => {
            expressValue[`:val${item}`] = item
        })
        const params = {
            TableName: 'BillOfLading',
            FilterExpression: `#blStatus IN (${filterExpresstion.join(",")})`,
            ExpressionAttributeNames: {
                "#blStatus": "billOfLadingStatus"
            },
            ExpressionAttributeValues: expressValue,
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
    async updateBillOfLadings(req, res) {
        const blId = req.params.id;
        const { billOfLadingStatus,estimateRoute } = req.body;
        if (!billOfLadingStatus || !estimateRoute){
            res.send({
                code: 500,
                message: "Thiếu tham số để cập nhật"
            })
            return;
        }
        const params = {
            TableName: "BillOfLading",
            Key: {
                "billOfLadingID": blId
            },
            UpdateExpression: 'set #status = :statusVal, #eR = :eRVal',
            ExpressionAttributeNames: { 
                '#status': 'billOfLadingStatus',
                '#eR': 'estimateRoute',
            },
            ExpressionAttributeValues: { 
                ':statusVal': billOfLadingStatus,
                ':eRVal' : estimateRoute
            },
        };

        try {
            await dynamoClient.update(params).promise();
            res.json({
                code: 200,
                message: 'Cập nhật vận đơn thành công!'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                code: 500,
                message: 'Lỗi cập nhật vận đơn',
                error: error
            });
        }
    }
}
module.exports = new BillOfLadingsController;