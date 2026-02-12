const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/** 
* - user Register controller
* - POST /api/auth/register
*/



async function userRegsterController(req,res){
   const { email, name, password } = req.body;

   const isExists = await userModel.findOne ({
    email: email
   })

   if(isExists){
    return res.status(422).json({
        message: "User already exists with this email",
        status: "failed"
    })
   }

   const user = await userModel.create({
        email,password,name
   })

   const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn: "3d"})
   res.cookies("token", token)

   res.status(201).json({
    user: {
        _id: user._id,
        email: user.email,
        name: user.name
    },
    token
   })
}


module.exports = {userRegsterController }