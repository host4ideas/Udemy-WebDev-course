const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(url);

// Database Name
const dbName = 'fruitsDB';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('fruits');

    // the following code examples can be pasted here...

    const insertResult = await collection.insertMany(
        [
            {
                name: "Apple",
                score: 8,
                review: "Great fruit"
            },
            {
                name: "Orange",
                score: 6,
                review: "Kinda sour"
            },
            {
                name: "Banana",
                score: 9,
                review: "Great stuff!!"
            }
        ]
    );
    console.log('Inserted documents =>', insertResult);

    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);

    return 'done.';
}

main()
    // log 'done.'
    .then(console.log)
    // log errors
    .catch(console.error)
    // Whatever occurs close the connection
    .finally(() => client.close());

