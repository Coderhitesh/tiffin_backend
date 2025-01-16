const UserModel = require('../models/user.model')

exports.createUser = async(req,res) => {
    try {
        const {name,email,number} = req.body;
        const newUser = new UserModel({
            name,
            email,
            number
        })

        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        })
    } catch (error) {
        console.log("Internal server error",error)
        res.status(500).json({
            success: false,
            message:"Internal server error",
            error: error.message
        })
    }
}