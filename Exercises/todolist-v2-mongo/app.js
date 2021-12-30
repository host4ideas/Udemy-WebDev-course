const { log } = require('console');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;

const app = express();
const port = 3000;
mongoose.connect("mongodb://Localhost:27017/todolistDB");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const itemSchema = new Schema({
    name: String
});

const Item = model("Item", itemSchema);

const item1 = new Item({
    name: "Item 1"
});

const item2 = new Item({
    name: "Item 2"
});

const item3 = new Item({
    name: "Item 3"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = new model('List', listSchema);

app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to DB.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });

});

app.get('/:customList', (req, res) => {
    const customListName = _.kebabCase(req.params.customList);
    customListName = _.capitalize(customListName);

    if (customListName == 'about') {
        res.render('about');
    } else {
        List.find({ name: customListName }).then(result => {
            if (result.length < 1) {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save().then(result => {
                    res.redirect(`/${customListName}`)
                }, err => {
                    log(err);
                });
            } else {
                // Show existing list
                res.render('list', { listTitle: customListName, newListItems: result[0].items });
            }
        }, err => {
            log(err);
        });
    }
});

app.post('/', (req, res) => {
    let item = new Item({
        name: req.body.newItem
    });

    List.findOneAndUpdate({ name: req.body.list }, { $push: { items: item } }).then(result => {
        log(req.body.list);
        res.redirect(`/${req.body.list}`);
    }, err => {
        log(err);
    });
});

app.post('/delete', (req, res) => {
    Item.findByIdAndDelete(req.body.checkbox).then(result => {
        res.redirect('/');
    }, err => {
        log(err);
    });
});

app.listen(port, (req, res) => {
    log(`Server running at: http://localhost:${port}`)
});