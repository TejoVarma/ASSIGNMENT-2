const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const posts = Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true 
    },
    user : {
        type : String,
        ref : 'User'
    }
});

const Posts = mongoose.model("posts", posts);

module.exports = Posts;