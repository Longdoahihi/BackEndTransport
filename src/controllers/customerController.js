const { dynamoClient } = require("../config/db");

class CustomerController {
    getCustomers(req, res) {
        dynamoClient.scan({
            TableName: 'Customer'
        }, function (err, data) {
            if (err) {
                res.send({
                    code: 500,
                    message: ""
                })
            } else {
                res.send({
                    code: 200,
                    data: data.Items
                })
            }
        });
    }
}

module.exports = new CustomerController;