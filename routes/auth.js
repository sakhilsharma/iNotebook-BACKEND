const express = require('express');
const router = express.Router();//modular, mountable route handlers:helps to handle routes 
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
//Create a  user using :POST "/api/auth/createuser"


router.post('/createuser', [
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





module.exports = router;