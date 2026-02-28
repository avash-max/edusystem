const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const resetPassword= async(req, res) =>{

    try{   
        const{ token, password } = req.body;

        if(!token || !password){
            return res.status(400).json({
                message: "token or password cannot be null"
            })
        }
        const user = await User.findOne({where:{verificationToken: token}});

        if(!user){
            return res.status(400).json({
                message: "invalid tokin passed"
            })
        }

        user.password = bcrypt.hashSync(password, 10);
        user.verificationToken = null,
        user.verificationTokenExpires = null

        user.save();

        return res.status(201).json({
            message: "password reset successful"
        })
    }catch(error){
        return res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}

module.exports = resetPassword;