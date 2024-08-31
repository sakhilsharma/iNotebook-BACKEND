const express = require('express');
const router = express.Router();//modular, mountable route handlers:helps to handle routes 
router.get('/',(req,res)=>{
    res.send("notes");
});
module.exports = router;