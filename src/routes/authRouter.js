const express = require('express');
const authRouter = express.Router();
const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
authRouter.post('/register', async (req,res) => {
    const {name, email, password} = req.body;
    const isAlreadyExists = await userModel.findOne({email});
    if(isAlreadyExists){
        return res.status(409).json({
            message: "User already exists with this email."
        })
    }
    const hash = crypto.createHash('md5').update(password).digest('hex');
    const user = await userModel.create({name, email, password: hash})
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

authRouter.get('/protected', async(req,res) => {
    console.log(req.cookies);
})

authRouter.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({
            message: "User does not exists with this email."
        })
    }

    const isPasswordMatched = user.password === crypto.createHash('md5').update(password).digest('hex');

    if(!isPasswordMatched){
        return res.status(401).json({
            message: "Invalid Password."
        })
    }

    const token = jwt.sign({
        id: user._id
    },process.env.JWT_SECRET);

    res.cookie("jwt_token", token);

    res.status(200).json({
        message: "User Logged in successfully.",
        user
    })
})
module.exports = authRouter;