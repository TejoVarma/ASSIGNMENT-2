const db = require('./src/config/db');
const express = require('express');
const mongoose  = require('mongoose')
const PORT = 3000;
const app = express();
const user = require('./src/routes/user');
const posts = require('./src/routes/posts');


mongoose.connect(db.DATABASE)
.then(()=>console.log("connected to db"));

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use('/', user);
app.use('/', posts);

app.listen(PORT, ()=>{
    console.log("Server is running");
});

module.exports = app;