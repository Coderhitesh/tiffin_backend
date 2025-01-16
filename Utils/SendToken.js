const jwt = require('jsonwebtoken')
require('dotenv').config()

const sendToken = async (user, res, status) => {
    try {
        //Generate JWT Token
        const token = jwt.sign({ id: user }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME
        })

        console.log("token",token)

        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true
        };

        console.log("options",options)

        // Send token in cookie
        res.status(status).cookie('token', token, options).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = sendToken;