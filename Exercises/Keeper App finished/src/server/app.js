require("dotenv").config();
const { log } = require("console");
// const express = require("express");
import express from "express";
const bodyParser = require("body-parser");
import mongoose  from "mongoose";
const { Schema } = mongoose;
const { model } = mongoose;
////////// COOKIES //--------->
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
//<--------- COOKIES //////////
////////// OAuth 2.0 //--------->
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
//<--------- OAuth 2.0 //////////

// If the port isn't provided by Heroku, 300 will be used
const port = process.env.PORT || 3000;
const domain = (process.env.DOMAIN + process.env.PORT) || "http://localhost:3000";

const app = express();
app.use(express.static(__dirname + '../public'));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/keeperDB').catch(err => { log(err) });

app.get("/", (req, res) => {
	res.send("Server running!!!");
});

app.get("/api", (req, res) => {
	res.json({
		message: "Hello from server!"
	})
});

app.listen(port, (req, res) => {
	// For development use only
	log(`Server running at: http://localhost:${port}`);
});