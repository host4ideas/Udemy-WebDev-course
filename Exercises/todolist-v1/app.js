const { log } = require('console');
const express = require('express');
const bodyParser = require('body-parser');
const date = require(`${__dirname}/date.js`);

const app = express();
const port = 3000;
const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    let day = date.getDay();
    
    // In order to add a new item we need first to declare the newListItem
    res.render('list', { listTitle: day, newListItems: items });
});
app.get('/work', (req, res) => {
    res.render('list', { listTitle: "Work List", newListItems: workItems });
});
app.post('/', (req, res) => {
    let item = req.body.newItem;
    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, (req, res) => {
    log(`Server running at: http://localhost:${port}`)
});