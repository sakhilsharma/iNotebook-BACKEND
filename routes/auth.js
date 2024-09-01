const express = require('express');
const router = express.Router();//modular, mountable route handlers:helps to handle routes 
const User = require('../models/User.js');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
//Create a  user using :POST "/api/auth/createuser"



router.post('/createuser', [ //validation using express-validator
    body('email', 'enter a valid email').isEmail(),
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('password', 'password must be atleast 5 character', 'enter a valid password').isLength({ min: 5 }),

],
    async (req, res) => {

        //If there are error ,return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //try catch 
        try {
            //check whether the user with this email exist already
            let user = await User.findOne({ email: req.body.email }); //find user in database

            if (user) {
                return res.status(400).json({ error: "Sorry a user with this email already exist" })
            }

            //password hashing
            const salt = bcrypt.genSalt(10);
            const secpass = await bcrypt.hash(req.body.password, 10);



            //if uer doesn't exist then create user
            user = await User.create({
                name: req.body.name,
                password: secpass,
                email: req.body.email,
            })
            /*.then(user => res.json(user))
            .catch(err=> {res.json('please enter a unique value');
                console.log(err);//will throw err
            })*/

            res.json(user);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Some error occured");
        }

    }
);
//Authenticate a user using: POST  "/api/auth/login" NO login required

router.post('/login', [ //validation using express-validator
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()


], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) { //false value on empty /null
            return res.status(400).json({ error: "Please try to login with coreect Credentials" });
        }
        const passCompare = await bcrypt.compare(password, user.password); //internally match hashes and return true/false
        //if return false value
        if (!passCompare) {
            return res.status(400).json({ error: "Please try to login with coreect Credentials" });
        }

        //JWT token
        //data to be sent  in json object
        const data = {
            user: { id: user.id }
        }
        //token creater(contain info of user)
        const authtoken = jwt.sign({ data }, "secret");

        //send JWT as response or via cookies
        res.json({ authtoken });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internel Server Error");
    }
}
)



module.exports = router;