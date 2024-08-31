const mongoose = require('mongoose');


async function ConnectWithMoongoose() {
    await mongoose.connect('mongodb://127.0.0.1:27017/iNotebook');
    console.log("connection with mongoose successful");
}
ConnectWithMoongoose().catch(err => console.log(err));
module.exports = ConnectWithMoongoose;