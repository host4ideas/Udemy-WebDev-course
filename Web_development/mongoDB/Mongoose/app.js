const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;
const { log } = console;

// Create connection
mongoose.connect('mongodb://localhost:27017/fruitsDB');

// Foundation for every new fruits added
const fruitSchema = new Schema({
    name: {
        type: String,
        required: [true, `Don't have ideas?`]
    },
    rating: {
        type: Number,
        min: [1, 'At least one star please'],
        max: [10, '{VALUE} is to much love!']
    },
    review: String
});

// Create the model (constructor) from the schema
const Fruit = model('Fruit', fruitSchema);

// New document (instance of Fruit)
const apple = new Fruit({
    name: 'Apple',
    rating: 20,
    review: "The best fruit."
});
// FOR TESTING VALIDATIONS
// apple.save().then(result => {
//     log(result);
// }, err => {
//     log(err.message);
// })

// apple.save().then(result => {
//     log(result);
// }).catch(err => {
//     log(err.message);
// });

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

const personSchema = new Schema({
    name: String,
    age: Number,
    favoriteFruit: fruitSchema
});

const Person = model('Person', personSchema);

const pineapple = new Fruit({
    name: 'Pineapple',
    rating: 9.5,
    review: 'Great fruit'
})

const avocado = new Fruit({
    name: 'Avocado',
    rating: 7.5,
    review: 'Better a bit unripe'
})

const john = new Person({
    name: 'John',
    age: 37,
    favoriteFruit: avocado
});

// RELATIONSHIP PERSON - FRUIT

const amy = new Person({
    name: 'Amy',
    age: 12,
    favoriteFruit: pineapple
});

// pineapple.save();
// amy.save().then(result => {
//     log(result);
//     mongoose.connection.close();
// });

// avocado.save();
Person.updateOne({ name: 'John' }, { favoriteFruit: avocado }).then(result => {
    log(result)
}, err => {
    log(err)
});

// john.save().then(result => {
//     log(result);
//     mongoose.connection.close();
// });

// Insert document into fruits collection
// Fruit.insertMany([apple, kiwi, orange, banana], (err) => {
//     if (err) log(err);
//     else log('Saved fruits');
// });

// UPDATE
// Fruit.updateOne({ name: 'Apple' }, { name: 'Peach' }).then(result => {
//     log(result);
// }, err => {
//     log(err);
// })

// DELETE
Fruit.deleteOne({ name: 'Peach' }).then(result => {
    log(result);
}, err => {
    log(err);
});

Fruit.find().then(result => {
    result.forEach(fruit => {
        log(fruit.name);
    })
});

// Person.deleteMany({ name: 'John' }).then(result => {
//     log(result)
// }, err => {
//     log(err)
// });

Person.find().then(result => {
    result.forEach(fruit => {
        log(fruit.name);
    })
});
