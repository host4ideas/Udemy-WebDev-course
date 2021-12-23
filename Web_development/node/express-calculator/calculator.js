const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
const port = 3000;

app.get('/calculator', (req, res) => {
    res.sendFile(__dirname + "/calculator.html");
});
app.post('/calculator', (req, res) => {
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var result = num1 + num2;
    res.send(`Result is ${result}`)
});

app.get('/bmiCalculator', (req, res) => {
    res.sendFile(`${__dirname}/bmiCalculator.html`)
});

app.post('/bmiCalculator', (req, res) => {
    var weight = req.body.weight;
    var height = req.body.height;
    
    res.send(`Your BMI is ${weight / height}`)
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
});