const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/keeperDB").catch(err => {
    console.log("Error connecting the DB");
});

