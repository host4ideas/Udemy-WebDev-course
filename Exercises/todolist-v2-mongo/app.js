const { log } = require('console');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
require('dotenv').config();

let port = process.env.PORT;
const app = express();
// let uri = "mongodb://localhost:27017/todolistDB";
let uri = `mongodb+srv://admin:${process.env.MONGODB_PASSWD}@cluster0.mvhsi.mongodb.net/todolistDB?retryWrites=true&w=majority`;
mongoose.connect(uri);

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
	res.redirect("/Today");
});

app.get('/:customList', (req, res) => {
	let customListName = _.kebabCase(req.params.customList);
	customListName = _.capitalize(customListName);

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
	const listName = req.body.listName;
	const elementId = req.body.checkbox;
	log(elementId);

	List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: elementId } } }).then(result => {
		res.redirect("/" + listName);
	}, err => {
		log(err);
	});
});

app.get("/about", function (req, res) {
	res.render("about");
});

if (port == null || port == "") {
	port = 3000;
}

// If the port doens't exist in the .env file (development environment),
// the port will be provided by Heroku
app.listen(port, (req, res) => {
	// For development use only
	log(`Server running at: http://localhost:${port}`)
});
