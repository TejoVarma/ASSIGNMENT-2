const express = require('express');
const router = express.Router();

let posts = require('../controllers/posts.controller');


router.post('/posts', posts.newPost);
router.get('/posts',posts.getPosts);
router.put('/posts/:id', posts.updatePost);
router.delete('/posts/:id', posts.deletePost);

module.exports = router;