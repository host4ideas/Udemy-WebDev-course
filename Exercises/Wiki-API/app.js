const { log } = console;
const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;
const bodyParser = require('body-parser');

mongoose.connect("mongodb://localhost:27017/wikiDB").catch(err => log("There was a connection error"));

let port = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const articleSchema = new Schema({
	title: String,
	content: String
});

const Article = new model('Article', articleSchema);

///////////////////////////// Requests Targetting All Articles /////////////////////////////////////
// Chainable routes
app.route('/articles')
	// GET
	.get((req, res) => {
		Article.find({}, (err, result) => {
			// if (!err) res.render('articles', { articlesList: result });
			if (!err) res.send(result);
			else res.send(err);
		});
	})
	// POST
	.post((req, res) => {
		log(req.body.title);
		log(req.body.content);

		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content
		});

		newArticle.save().then();
	})
	// DELETE
	.delete((req, res) => {
		Article.deleteMany((err) => {
			if (!err) res.send('Successfully deleted all'); else res.send(err);
		});
	});

app.get('/', (req, res) => {
	res.send('Server running');
});

///////////////////////////// Requests Targetting A Specific Article //////////////////////////////////

app.route('/articles/:article')
	// Get a specific document
	.get((req, res) => {
		Article.findOne({ title: req.params.article }, (err, result) => {
			if (result) {
				res.send(result);
			} else {
				res.send('No articles matching that title was found');
			}
		});
	})
	// Replace an entire document (same as uptadeOne {overwrite: true})
	.put(async (req, res) => {
		try {
			const result = await Article.replaceOne({ title: req.params.article }, { title: req.body.title, content: req.body.content });
			if (result.modifiedCount < 1) {
				res.send('No changed documents')
			} else {
				res.send("Succesfully changed the selected article")
			}
		} catch (err) { res.send(err) }
	})
	.patch((req, res) => {
		Article.updateOne({ title: req.params.article }, { $set: req.body }).then((result => {
			if (result.modifiedCount < 1) {
				res.send('Article not updated')
			} else {
				res.send('Succesfully updated')
			}
		})).catch((error) => {
			res.send(error)
		});
	})
	.delete((req, res) => {
		Article.findOneAndDelete({ title: req.params.article }).then(result => {
			res.send(result);
		}, err => {
			res.send(err);
		});
	});

app.listen(port, () => {
	// For development use only
	log(`Server running at: http://localhost:${port}`);
});