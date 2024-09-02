const express = require('express');
const router = express.Router();//modular, mountable route handlers:helps to handle routes 
const fetchuser = require('../middleware/fetchuser.js');
const Notes = require('../models/Notes.js');
const { body, validationResult } = require('express-validator');
//Route1:Get All the notes :Get"/api/auth/fetchallnotes
//to fetch data of user : used middlwware fetchuser
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
});

//Route 2:Add a new Note using , POST :"/api/auth/addnote" Login required
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),


], async (req, res) => {
    //would validate note too
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            user: req.user.id,
            title: title,
            description: description,
            tag: tag,
        })
        const savedNote = await note.save();
        console.log(savedNote);
        res.json(savedNote);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internel Server Error");
    }

}
)

module.exports = router;