const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;
const { log } = console;

// // Create connection
const connection = mongoose.connect('mongodb://localhost:27017/fruitsDB');

// // Foundation for every new fruits added
const fruitSchema = new Schema({
    name: String,
    rating: Number,
    review: String
});

// // Create the model (constructor) from the schema
const Fruit = model('Fruit', fruitSchema);

// // New document (instance of Fruit)
const kiwi = new Fruit({
    name: "Kiwi",
    rating: 10,
    review: "The best fruit."
});

const orange = new Fruit({
    name: "Orange",
    rating: 4,
    review: "Too sour for me."
});

const banana = new Fruit({
    name: "Banana",
    rating: 3,
    review: "Weird texture."
});

// Insert document into fruits collection
Fruit.insertMany([kiwi, orange, banana], (err) => {
    if (err) log(err); 
    else log('Saved fruits');
});

const personSchema = new Schema({
    name: String,
    age: Number
});

const Person = model('Person', personSchema);

const person = new Person({
    name: 'John',
    age: 37
});

person.save().then(result => {
    log(result);
    mongoose.connection.close();
});