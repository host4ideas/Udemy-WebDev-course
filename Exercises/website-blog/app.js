require('dotenv').config();
const { log } = require('console');
const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;

let port = process.env.PORT;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/blogDB");

// MongoDB Schema
const postSchema = new Schema({
	title: 'String',
	content: 'String'
});
// MongoDB model
const Post = new model('Post', postSchema);

// Pages content
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts = [];

app.get('/', (req, res) => {
	Post.find().then(result => {
		res.render('home', { startingContent: homeStartingContent, posts: result, lodash: _ });
	});
});

app.get('/about', (req, res) => {
	res.render('about', { aboutContent: aboutContent });
});

app.get('/contact', (req, res) => {
	res.render('contact', { contactContent: contactContent });
});

app.get('/compose', (req, res) => {
	res.render('compose');
});

app.get('/posts/:article', (req, res) => {
	// Since the name in DB is kebab case and the title shouldn't,
	// first we convert the input into kebab case, search,
	// and then show it not kebab case
	let postTitle = _.kebabCase(req.params.article);

	Post.find({ title: postTitle }).then(result => {
		if (result.length > 0)
			res.render('post', { postTitle: _.capitalize(result[0].title.split('-').join(' ')), postContent: result[0].content });
	}, err => {
		log(err);
	})
});
// When a post is submitted, format to kebab case the title
app.post('/compose', (req, res) => {
	const postTitle = _.kebabCase(req.body.postTitle);

	Post.find({ title: postTitle }).then(result => {
		if (result.length > 0) {
			// If the post exist redirect to that post
			res.render('post', { postTitle: _.capitalize(result[0].title.split('-').join(' ')), postContent: result[0].content });
			res.redirect(`/posts/${result[0].title}`);
		} else {
			// If the post doesn't exits, create a new post
			let post = new Post({
				title: _.kebabCase(req.body.postTitle),
				content: req.body.postBody
			});

			post.save((err, result) => {
				(!err) ? res.redirect(`/posts/${postTitle}`) : log(err);
			});
		}
	}, err => {
		log(err);
	})
});

// If the port doens't exist in the .env file (development environment),
// the port will be provided by Heroku
if (port == null || port == "") {
	port = 3000;
}

app.listen(port, function () {
	// For development use only
	log(`Server running at: http://localhost:3000`);
});
