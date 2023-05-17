const { dynamoClient } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const generateToken = async (payload, secretSignature, tokenLife) => {
    try {
        return await sign(
            {
                payload,
            },
            secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife,
            },
        );
    } catch (error) {
        console.log(`Error in generate access token:  + ${error}`);
        return null;
    }
};
class AdminLoginController {
    async login(req, res) {
        const { email, password } = req.body;
        //Kiểm tra người dùng có tồn tại hay không 
        const params = {
            TableName: 'Employee',
            KeyConditionExpression: '#email = :emailValue',
            ExpressionAttributeNames: {
                '#email': 'email'
            },
            ExpressionAttributeValues: {
                ':emailValue': email
            }
        };
        try {
            dynamoClient.query(params, async (err, data) => {
                console.log(data);
                //Nếu không tìm thấy email trong csdl
                if (!!err || !data || data.Items.length === 0) {
                    res.send({
                        code: 500,
                        message: "Thông tin tài khoản hoặc mật khẩu không chính xác"
                    })
                    return;
                } else {
                    //Nếu tìm thấy
                    const userInfo = data.Items[0];
                    const isPasswordValid = bcrypt.compareSync(password, userInfo.password);
                    if (isPasswordValid) {
                        //Tạo access token
                        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
                        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
                        const dataForAccessToken = {
                            email: userInfo?.email ?? "",
                            role: "employee"
                        };
                        const accessToken = await generateToken(
                            dataForAccessToken,
                            accessTokenSecret,
                            accessTokenLife,
                        );
                        if (!accessToken) {
                            res.send({
                                code: 500,
                                message: "Đăng nhập không thành công!"
                            })
                        }
                        const {
                            name,
                            email,
                            address,
                            dateOfBirth,
                            citizenIdentifycationNumber,
                            phoneNumber,
                            role,
                            warehouseID } = userInfo;
                        res.send({
                            code: 200,
                            accessToken,
                            data: {
                                name,
                                email,
                                address,
                                dateOfBirth,
                                citizenIdentifycationNumber,
                                phoneNumber,
                                role,
                                warehouseID,
                            }
                        })
                    } else {
                        res.send({
                            code: 500,
                            message: "Thông tin tài khoản hoặc mật khẩu không chính xác!"
                        })
                        return;
                    }
                }

            })
        } catch (error) {
            console.log("err: ", error);
        }
    }

}
module.exports = new AdminLoginController;