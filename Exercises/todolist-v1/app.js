const { log } = require('console');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
var items = ['Buy Food', 'Cook Food', 'Eat Food'];

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const today = new Date();

    // var currentDay = today.getDay();
    // const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // res.render('list', { kindOfDay: weekDays[currentDay] });

    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    var day = today.toLocaleDateString('es-ES', options);
    // In order to add a new item we need first to declare the newListItem
    res.render('list', { kindOfDay: day, newListItems: items });
});

app.post('/', (req, res) => {
    items.push(req.body.newItem);
    // Refresh page
    res.redirect('/');
});

app.listen(port, (req, res) => {
    log(`Server running at: http://localhost:${port}`)
});