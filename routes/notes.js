const express = require('express');
const router = express.Router();//modular, mountable route handlers:helps to handle routes 
const fetchuser = require('../middleware/fetchuser.js');
const Notes = require('../models/Notes.js');
const { body, validationResult } = require('express-validator');
//Route1:Get All the notes :Get"/api/notes/fetchallnotes
//to fetch data of user : used middlwware fetchuser
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
});

//Route 2:Add a new Note using , POST :"/api/notes/addnote" Login required
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

//Route:3 Update an existing note using: POST "/api/notes/updatenote" LOGIN required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    console.log(req.body);
    try {
        //Create a newNote Object
        const newNote = {};
        if (title) {
            newNote.title = title; //update titlw if title is part of request
        }
        if (description) {
            description.title = description; //update titlw if title is part of request
        }
        if (tag) {
            tag.title = tag; //update title if title is part of request
        }
        //to check the user /verify user
        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed"); // dont allow externel user to access the note of other
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });//update note and add new user if no note exist { $set: newNote }
        res.json({ note });
    }
    catch (error) {
        res.status(500).send("Internel Server Error");
    }
})

//Route 3:Delete an existing note using : DELETE '/api/notes/deletenote Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not Found");
        }
        //Allow deletion only if user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed"); // dont allow externel user to access the note of other
        }

        note = await Notes.findByIdAndDelete(req.params.id);//update note and add new user if no note exist { $set: newNote }
        res.json({ "Success": "Note has been deleted" });
    }
    catch (error) {
        res.status(500).send("Internel Server Error");
    }

}
)

module.exports = router;