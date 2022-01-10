const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
    title: String,
    content: String
});

const Note = new model("Note", noteSchema);

module.exports = Note;