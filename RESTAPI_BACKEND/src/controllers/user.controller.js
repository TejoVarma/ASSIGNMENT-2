const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');
const bcrypt = require('bcrypt')

let exportsRoutes = {};

exportsRoutes.register = async function(req,res){
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    let hash = await bcrypt.hash(password, 10);
    try{
        let user = new Users({
            userName : userName,
            email : email,
            password : hash
        });
        let newUser = user.save();
        res.status(200).json({status : "success", message : user});
    }
    catch(err)
    {
        res.status(401).json({status : "failed", message : err.message});
    }
}

exportsRoutes.login = async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    try{
        let validUser = await Users.findOne({email : email});
        if(validUser)
        {
            let valid = await bcrypt.compare(password, validUser.password);
            if(valid)
            {
                const token = await jwt.sign({userName : validUser.userName, email : validUser.email, _id: validUser._id}, db.secret);
                res.status(200).json({status : "success", token : "JWT " + token});
            }
            else
            {
                res.status(401).json({status : "failed", message : "Invalid credentials"});
            }
        }
        else
        {
            res.status(401).json({status: "failed", message : "User not found"});
        }
    }
    catch(err)
    {
        res.status(400).json({status: "failed", message : err.message});
    }
}

module.exports = exportsRoutes;