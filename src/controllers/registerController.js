const { dynamoClient } = require("../config/db");
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require("uuid");
class RegistersController {
    async register(req, res) {
        //Lấy email, passworld
        const { customerName, customerEmail, 
            phoneNumber, password, 
            customerAddress, provinceName,
            districtName, aparmentNumber } =
            req.body;
        //Kiểm tra trùng email
        const hashedPassword = await bcrypt.hash(password, 10);
        var params = {
            TableName: 'Customer',
            Item: {
                customerID: uuidv4(),
                customerName, customerEmail, phoneNumber, customerAddress, provinceName,
                districtName, aparmentNumber,
                password: hashedPassword
            }
        };
        dynamoClient.put(params, function (err, data) {
            //Thêm mới hoặc trả về message
            if (err) {
                res.send({
                    code: 500,
                    message: `register failed! : ${err}`
                });
            }
            else {
                res.send({
                    code: 200,
                    message: "Success!",
                    data: data
                });
            }
        });

    }

}
module.exports = new RegistersController;