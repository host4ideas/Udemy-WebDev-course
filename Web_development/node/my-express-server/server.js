const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send(`<h1>Hello world</h1>`);
    // response.send(`Hello world`);
});

app.get("/contact", (req, res) => {
    res.send("Contact me at: example@example.com");
});

app.get("/about", (req, res) => {
    res.send("Welcome to my page");
});

app.get("/hobbies", (req, res) => {
    res.send("I like to play videogames");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});