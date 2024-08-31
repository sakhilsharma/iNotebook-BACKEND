const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ConnectWithMoongoose = require('./db.js');
app.listen(5000, (req, res) => {
    console.log("connected");
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Available routes
app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/notes',require('./routes/notes.js'));
app.get('/', (req, res) => {
    console.log('connection successful');
    res.send('this is new journey');
})