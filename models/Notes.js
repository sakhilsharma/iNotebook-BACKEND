const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,

    },
    tag: {
        type: String,
        default:"General",
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;