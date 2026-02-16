const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/** 
* - user Register controller
* - POST /api/auth/register
*/



 function userRegsterController(req,res){
     try {
        const { email, name, password } = req.body;

        const isExists =  userModel.findOne({ email: email })

        if (isExists) {
            return res.status(422).json({
                message: "User already exists with this email",
                status: "failed"
            })
        }

        const user =  userModel.create({ email, password, name })

        const secret = process.env.JWT_SECRET
        if (!secret) {
            console.error('JWT_SECRET is not set in environment')
            return res.status(500).json({ message: 'Server misconfiguration' })
        }

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "3d" })
        // set cookie with sensible defaults
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })
    } catch (err) {
        console.error('Error in userRegsterController:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}


module.exports = {userRegsterController }