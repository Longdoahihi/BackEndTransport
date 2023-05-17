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
class LoginController {
    async login(req, res) {
        const { email, password } = req.body;
        //Kiểm tra người dùng có tồn tại hay không 
        const params = {
            TableName: 'Customer',
            KeyConditionExpression: '#customerEmail = :customerEmailValue',
            ExpressionAttributeNames: {
                '#customerEmail': 'customerEmail'
            },
            ExpressionAttributeValues: {
                ':customerEmailValue': email
            }
        };
        try {
            dynamoClient.query(params, async (err, data) => {
                //Nếu không tìm thấy email trong csdl
                if (!!err || !data || data.Items.length === 0) {
                    res.send({
                        code: 500,
                        message: "Thông tin tài khoản hoặc mật khẩu không chính xác"
                    })
                    return;
                } else {
                    //Nếu tìm thấy là tài khoản khách hàng
                    const userInfo = data.Items[0];
                    const isPasswordValid = bcrypt.compareSync(password, userInfo.password);
                    if (isPasswordValid) {
                        //Tạo access token
                        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
                        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
                        const dataForAccessToken = {
                            customerEmail: userInfo.customerEmail,
                            role: "customer"
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
                        //tạo refresh token
                        // let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
                        // if (!user.refreshToken) {
                        //     // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                        //     await userModel.updateRefreshToken(user.username, refreshToken);
                        // } else {
                        //     // Nếu user này đã có refresh token thì lấy refresh token đó từ database
                        //     refreshToken = user.refreshToken;
                        // }
                        const { 
                            customerID,
                            customerAddress,
                            phoneNumber,
                            districtName,
                            customerEmail,
                            provinceName,
                            aparmentNumber,
                            customerName, } = userInfo;
                        res.send({
                            code: 200,
                            accessToken,
                            data: {
                                customerID,
                                customerAddress,
                                phoneNumber,
                                districtName,
                                customerEmail,
                                provinceName,
                                aparmentNumber,
                                customerName,
                                role: "customer"
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
module.exports = new LoginController;