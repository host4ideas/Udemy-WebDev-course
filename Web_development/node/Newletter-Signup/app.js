require('dotenv').config();
const { log } = require('console');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const port = 3000;

// In order to be able to load static data as css or images
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/signup.html`)
});

app.post('/', (req, res) => {
    const email = req.body.email;
    const firstName = req.body.fName;
    const lastName = req.body.lName;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    // Ready to be sent to mailchimp
    const jsonData = JSON.stringify(data);

    const url = `https://us${process.env.MAILCHIMP_SERVER}.apiXmailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`

    const options = {
        method: 'POST',
        auth: `${process.env.MAILCHIMP_USER}:${process.env.MAILCHIMP_LIST_ID}`
    }

    const request = https.request(url, options, (response) => {
        response.on('data', (data) => {
            log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.listen(port, () => {
    log(`Server running on: http://localhost:${port}`)
});

