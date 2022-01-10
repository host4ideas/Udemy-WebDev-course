const express = require("express");
const bodyParser = require("body-parser");
const {log} = require("console");
const Note = require("./database");

app.use(bodyParser.urlencoded({ extended: true }));
const app = express();

app.get("/", (req, res) => {
    Note.find().then(result => {
        console.log(result);
    });
    res.send("Server running");
});

module.exports = app;