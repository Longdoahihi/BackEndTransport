const { dynamoClient } = require("../config/db");
const bcrypt = require('bcrypt');
class WarehouseController {
    async createWarehouse(req, res) {
        const {
            warehouseID,
            warehouseName,
            employee,
            province,
            district,
            type
        } = req.body;
        console.log({
            warehouseID,
            warehouseName,
            employee,
            province,
            district,
            type
        })
        var params = {
            TableName: 'Warehouse',
            Item: {
                warehouseID,
                warehouseName,
                employee,
                province,
                district,
                type
            }
        };
        dynamoClient.put(params, function (err, data) {
            //Thêm mới
            if (err) {
                res.send({
                    code: 500,
                    message: `create ware house failed! : ${err}`
                });
            }
            else {
                res.send({
                    code: 200,
                    message: "Success!",
                });
            }
        });
    }
    getWareHouses(req, res) {
        // Lấy các tham số truy vấn từ URL
        const { province, district } = req.query;

        // Tạo expression attribute values object để sử dụng trong biểu thức filter
        const expressionAttributeValues = {};

        // Tạo biểu thức filter dựa trên các tham số truy vấn được cung cấp
        let filterExpression = '';
        let expressionAttributeNames = {};
        let query = {}
        if (province) {
            filterExpression += 'contains(#province, :province)';
            expressionAttributeValues[':province'] = province;
            expressionAttributeNames['#province'] = 'province';
        }
        if (district) {
            if (filterExpression !== '') {
                filterExpression += ' AND ';
            }
            filterExpression += 'contains(#district, :district)';
            expressionAttributeValues[':district'] = district;
            expressionAttributeNames['#district'] = 'district';
        }
        if (!!province || !!district) {
            query = {
                FilterExpression: filterExpression,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
            }
        }
        console.log("abcabcabc::::::::",query)
        // Tạo DynamoDB scan params object với biểu thức filter và attribute names/values đã tạo
        const params = {
            TableName: 'Warehouse',
            ...query
        };

        // Thực hiện scan bảng DynamoDB với các params đã tạo
        dynamoClient.scan(params, (err, data) => {
            if (err) {
                console.error('Lỗi khi scan bảng DynamoDB: ', err);
                res.status(500).send({
                    message: 'Lỗi khi lấy dữ liệu từ bảng DynamoDB',
                    province: "",
                    district: ""
                });
            } else {
                res.send(data.Items);
            }
        });
    }

    getWareHouseByID(req, res) {
        const id = req.params.id;
        // Tạo params object để truy vấn dữ liệu từ DynamoDB
        const params = {
            TableName: 'Warehouse',
            Key: { "warehouseID": id }
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
                    message: 'Không tìm thấy kho hàng!'
                });
            } else {
                res.json({
                    code: 200,
                    data: data?.Item ?? {}
                });
            }
        });
    }

}
module.exports = new WarehouseController;
