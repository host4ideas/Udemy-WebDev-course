require('dotenv').config();
const { log } = require('console');
const { response } = require('express');
const express = require('express');
const https = require('https');
const { stringify } = require('querystring');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.post('/', (req, res) => {
    const query = req.body.cityName;

    const apiKey = `${process.env.OPEN_WEATHER_API_KEY}`;

    const units = 'metric';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;
    https.get(url, (response) => {
        log(response.statusCode);
        response.on('data', (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            log(temp);
            log(description);
            res.write(`<h1>The temperature in ${query} is ${temp} degrees Celcius.</h1>`);
            res.write(`<p>The weather is currently ${description}</p>`);
            res.write(`<img src='http://openweathermap.org/img/wn/${icon}@2x.png'></img>`)
            res.send();
        });
    });
});


app.listen(port, () => {
    log(`Server running at: http://localhost:${port}`);
});