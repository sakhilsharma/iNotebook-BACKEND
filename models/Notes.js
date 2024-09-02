const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    //send a refernce of user so that user can view only its own notes 
    //This field is a reference to another model, commonly used in MongoDB for creating relationships between documents in different collections
    user: {
        //The ObjectId type is a special type in MongoDB that stores unique identifiers for documents. It’s the standard type used for referencing other documents
        type: mongoose.Schema.Types.ObjectId,
        ref: "user" //refernce model is user
    },
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
        default: "General",
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

const Notes = mongoose.model("Notes", NotesSchema);
module.exports = Notes;