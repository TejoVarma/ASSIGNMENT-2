let exportRoutes = {};
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const Post = require('../models/posts.model');

exportRoutes.newPost = async function(req,res){
    try
    {
        let token = await getToken(req.headers);
        let payload = await jwt.verify(token,db.secret);
        // console.log("from payload ",payload);
        if(token)
        {
            let newPost =await new Post({
                title : req.body.title,
                body : req.body.body,
                image : req.body.image,
                user : payload._id
            });

            let post = newPost.save();

            res.status(200).json({status: "success", message: newPost});
        }
        else 
        {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    }
    catch(err)
    {
        res.status(403).send({status:"failed", message: err.message});
    }
};

exportRoutes.getPosts = async function(req,res){
    try
    {
        let token = await getToken(req.headers);
        if(token)
        {
            let posts = await Post.find();
            res.status(200).json({status: "success", message: posts});
        }
        else 
        {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    }
    catch(err)
    {
        res.status(403).send({status:"failed", message: err.message});
    }
};

exportRoutes.updatePost = async function(req,res){
    try
    {
        let token = await getToken(req.headers);
        if(token)
        {
            let payload = await jwt.verify(token,db.secret);
            let posts = await Post.findById(req.params.id);
            // console.log(posts);
            if(posts && posts.user === payload._id)
            {
                posts = await Post.findByIdAndUpdate(req.params.id,req.body, {new:true});
                res.status(200).json({status:"success", message : posts});
            }
            else
            {
                res.status(403).json({status: "failed", message: "Unauthorised"});
            }
        }
        else 
        {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    }
    catch(err)
    {
        res.status(403).send({status:"failed", message: err.message});
    }
};

exportRoutes.deletePost = async function(req,res){
    try
    {
        let token = await getToken(req.headers);
        if(token)
        {
            let payload = await jwt.verify(token,db.secret);
            let posts = await Post.findById(req.params.id);
            // console.log(posts);
            if(posts)
            {
                if(posts.user === payload._id)
                {
                    posts = await Post.findByIdAndDelete(req.params.id);
                    posts.save();
                    res.status(200).json({status:"success", message : "successfully deleted"});
                }
                else
                {
                    res.status(403).json({status: "failed", message:"Unauthorised"});
                }
            }
            else
            {
                res.status(401).json({status: "failed", message:"Post Not found"});
            }
        }
        else 
        {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    }
    catch(err)
    {
        res.status(403).send({status:"failed", message: err.message});
    }
};

function getToken(headers)
{
    if(headers && headers.authorization)
    {
        let parted = headers.authorization.split(' ');
        if(parted.length == 2)
        {
            return parted[1]
        }
        else
        {
            return null;
        }
    }
    else
    {
        return null;
    }
};

module.exports = exportRoutes;