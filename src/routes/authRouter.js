const express = require('express');
const authRouter = express.Router();
const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
authRouter.post('/register', async (req,res) => {
    const {name, email, password} = req.body;
    const isAlreadyExists = await userModel.findOne({email});
    if(isAlreadyExists){
        return res.status(400).json({
            message: "User already exists with this email."
        })
    }
    const user = await userModel.create({name, email, password})
    const token = jwt.sign({
        id: user._id,
        email: user.email
    },process.env.JWT_SECRET);

    res.cookie("jwt_token", token);

    res.status(201).json({
        message: "User created Successfully.",
        user,
        token
    })
})
module.exports = authRouter;