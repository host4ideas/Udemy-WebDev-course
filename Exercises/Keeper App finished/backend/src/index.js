const app = require("./app");
require("./database");
require("dotenv").config();

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
    console.log(`Server running at: http://localhost:${port}`);
});