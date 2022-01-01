require('dotenv').config();
const { log } = console;
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
////////// COOKIES CONFIG //--------->
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
//<--------- COOKIES CONFIG //////////

let port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

////////// COOKIES CONFIG //--------->
// Session setup
app.use(session({
	secret: 'asñldfqewrpujñvslx',
	resave: false,
	// Better set it false
	saveUninitialized: false,
	// Only with https servers
	// cookie: { secure: true }
}))
//<--------- COOKIES CONFIG //////////

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB').catch(err => { log(err) });

const newUserchema = new Schema({
	username: String,
	password: String
})

// Password encryption with mongoose-encryption
// newUserchema.plugin(encrypt, { secret: process.env.SECRET_STRING, encryptedFields: ['password'] });

////////// COOKIES CONFIG //--------->
// Add passport-local as a plugin to the Schema
newUserchema.plugin(passportLocalMongoose);
//<--------- COOKIES CONFIG //////////

const User = new model('User', newUserchema);

////////// COOKIES CONFIG //--------->
// requires the model with Passport-Local Mongoose plugged in
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//<--------- COOKIES CONFIG //////////

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/register', (req, res) => {
	res.render('register');
});

// app.post('/register', (req, res) => {
// 	bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
// 		// Store hash in your password DB.
// 		const newUser = User({
// 			username: req.body.username,
// 			password: hash
// 			// MD5 hashing
// 			// password: md5(req.body.password)
// 		});

// 		newUser.save().then(result => {
// 			res.render('secrets');
// 		}, err => {
// 			log(err.message);
// 		});
// 	});
// });

app.post("/register", function (req, res) {
	User.register({ username: req.body.username }, req.body.password).then(() => {
		passport.authenticate('local', {
			successRedirect: '/secrets',
			failureRedirect: '/register'
		});
	}, err => {
		res.redirect("/register");
	});
});

app.get('/secrets', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('secrets');
	} else {
		res.redirect('/login');
	}
});

app.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/');
});

app.post('/login', (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password
	});

	req.login(user, (err) => {
		if (err) {
			return next(err)
		}
		passport.authenticate('local', {
			successRedirect: '/secrets',
			failureFlash: 'Invalid username or password.'
		});
	})
});

app.listen(port, (req, res) => {
	log(`Server running at http://localhost:3000`);
})