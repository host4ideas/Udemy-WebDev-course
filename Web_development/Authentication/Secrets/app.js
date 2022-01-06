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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const FacebookStrategy = require('passport-facebook');

const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN + process.env.PORT || "http://localhost:3000";

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

const userSchema = new Schema({
	username: String,
	password: String,
	// Add googleId for OAuth
	googleId: String,
	facebookId: String,
	// Secret posts
	secret: String
})

// Password encryption with mongoose-encryption
// userSchema.plugin(encrypt, { secret: process.env.SECRET_STRING, encryptedFields: ['password'] });

// Add passport-local and findOrCreate as a plugins to the Schema
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new model('User', userSchema);

////////// COOKIES CONFIG //--------->
// requires the model with Passport-Local Mongoose plugged in
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
// Only suitable for the passport-local-mongoose package
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Suitable for all types of strategies
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
//<--------- COOKIES CONFIG //////////

app.get('/', (req, res) => {
	res.render('home');
});

////////// OAuth 2.0 //--------->
passport.use(new GoogleStrategy({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	callbackURL: `${domain}/auth/google/secrets`
},
	function (accessToken, refreshToken, profile, cb) {
		log(profile);
		User.findOrCreate({ username: profile.displayName, googleId: profile.id }, function (err, user) {
			return cb(err, user);
		});
	}
));

app.get('/auth/google',
	passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/secrets',
	passport.authenticate('google', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect secrets.
		res.redirect('/secrets');
	}
);

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: `${domain}/auth/facebook/secrets`
},
	function (accessToken, refreshToken, profile, cb) {
		User.findOrCreate({ username: profile.displayName, facebookId: profile.id }, function (err, user) {
			return cb(err, user);
		});
	}
));

app.get('/auth/facebook',
	passport.authenticate('facebook')
);

app.get('/auth/facebook/secrets',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect secrets.
		res.redirect('/secrets');
	}
);
//<--------- OAuth 2.0 //////////

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post("/register", function (req, res) {
	User.register({ username: req.body.username }, req.body.password).then(() => {
		passport.authenticate("local", { failureRedirect: '/register' })(req, res, function () {
			res.redirect("/secrets");
		});
	}, err => {
		res.redirect("/register");
	});
});

app.get('/secrets', (req, res) => {
	if (req.isAuthenticated()) {

		// Field secret not null
		User.find({ 'secret': { $ne: null } }).then(foundUsers => {
			res.render('secrets', { usersWithSecrets: foundUsers })
		}, err => { log(err) });

	} else {
		res.redirect('/login');
	}
});

app.get('/submit', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('submit');
	} else {
		res.redirect('/login');
	}
});

app.post('/submit', (req, res) => {
	const submittedSecret = req.body.secret;

	User.findById(req.user.id, (err, foundUser) => {
		if (err) {
			log(err);
		} else if (foundUser) {
			foundUser.secret = submittedSecret;
			foundUser.save().then(() => { res.redirect('/secrets') });
		} else {
			res.redirect('/login');
		}
	});
});

app.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/');
});

app.post("/login", function (req, res) {

	const user = new User({
		username: req.body.username,
		password: req.body.password
	});

	req.login(user, function (err) {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate("local", { failureRedirect: '/login' })(req, res, function () {
				res.redirect("/secrets");
			});
		}
	});
});

app.listen(port, (req, res) => {
	log(`Server running at http://localhost:3000`);
})