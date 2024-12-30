'use strict';

// load package
const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res, next) => {
    res.sendFile('/Server/posting.html');
})

app.get('/readPosts', (req,res) => {
    fs.readFile('Data/posts.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File read successfully');
            res.type('text').send(data);
        }
    });
});


app.post('/posting', (req,res) => 
    {
    var topic = req.body.topic;
    var data = req.body.data;
    
    var date = new Date();
    var curr_date = date.getDate();
    var curr_month = date.getMonth() + 1;
    var curr_year = date.getFullYear();
    var curr_hour = date.getHours();
    var curr_min = date.getMinutes();
    var curr_sec = date.getSeconds();
    var formatted_date = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_min + ":" + curr_sec + " YYYY-MM-DD hh:mm:ss"
    
    fs.writeFile('Data/posts.txt', '{ Topic: '+ topic +' Data: '+ data + ' Timestamp(UTC-0): ' + formatted_date + ' }\n', { flag: 'a+' }, err => 
        {
        if (err) 
            {
                console.error('Error writing file', err);
                res.status(500).send('Error writing file');
            }
            else {
                console.log('File written successfully');
            }
        });
    });


app.use('/posting', express.static('Data/posts.txt'));

app.listen(PORT, HOST);

console.log('up and running');