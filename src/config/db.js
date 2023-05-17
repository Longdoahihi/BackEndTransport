//aws
const AWS = require('aws-sdk');
// AWS.config.update({
//     region: 'us-east-1',
//     endpoint: 'http://localhost:8000'
// });
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const dynamodb = new AWS.DynamoDB();
const dynamoClient = new AWS.DynamoDB.DocumentClient();
//delete table
function deleteTable(tableName) {
    var params = {
        TableName: tableName
    };
    dynamodb.deleteTable(params, function (err, data) {
        if (err && err.code === 'ResourceNotFoundException') {
            console.log("Error: Table not found");
        } else if (err && err.code === 'ResourceInUseException') {
            console.log("Error: Table in use");
        } else {
            console.log("Success", data);
        }
    });
}
// deleteTable("Customer");
//create table
if (dynamodb.listTables((err, data) => {
    if (err) {
        console.error(err);
    } else {
        if (!data.TableNames.includes("Customer")) {
            const params = {
                TableName: 'Customer',
                KeySchema: [
                    { AttributeName: 'customerEmail', KeyType: 'HASH' }, // Khóa chính HASH
                    { AttributeName: 'customerName', KeyType: 'RANGE' } // Khóa chính RANGE
                ],
                AttributeDefinitions: [
                    { AttributeName: 'customerEmail', AttributeType: 'S' },
                    { AttributeName: 'customerName', AttributeType: 'S' },
                    // { AttributeName: 'phoneNumber', AttributeType: 'S' },
                    // { AttributeName: 'passworld', AttributeType: 'S' },
                    // { AttributeName: 'customerAddress', AttributeType: 'S' },
                    // { AttributeName: 'provinceName', AttributeType: 'S' },
                    // { AttributeName: 'districtName', AttributeType: 'S' },
                    // { AttributeName: 'parmentNumber', AttributeType: 'S' },
                    // { AttributeName: 'gender', AttributeType: 'N' },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            };
            dynamodb.createTable(params, function (err, data) {
                if (err) {
                    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
                } else {
                    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
                }
            });
        }
    }
}))
module.exports = {
    dynamoClient,
    dynamodb
};