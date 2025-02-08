'use strict';

//load package
const bodyParser = require("body-parser");
const express = require("express");

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended: true}));

//server variables
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

//Message and reply arrays
var postMessages = [];
var replyMessages = [];
var messageId = 0;

/*Function to create timestamp
//No inputs
//Returns YYYY-MM-DD HH:MM:SS Z
*/
function timeStamp() {
    let date = new Date();
    let curr_date = date.getDate();
    let curr_month = date.getMonth() + 1;
    let curr_year = date.getFullYear();
    let curr_hour = date.getHours();
    let curr_min = date.getMinutes();
    let curr_sec = date.getSeconds();
    return curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_min + ":" + curr_sec + " Z";
}

//Root page set to posting.html
app.get('/', (req,res,next) => {
    res.sendFile('posting.html');
});

//Request to send all Posts and Replies
app.get('/alldata', (req,res) => {
    res.type('text').send(postMessages,replyMessages);
})

/*Create a new post, requires "topic" and "data"
//topic = text titling for the post
//data = text hopefully related to the title of the post
//Appends post as postMessages[newPostId] with {id: newPostId, topic: , data: <from parsed body>, date: time stamp}
//Returns {success: true, id: newPostId} or {success: false, message: error.message}
*/
app.post('/postmessage', (req, res) => {
    try {
        const { topic, data } = req.body;

        //check for required data
        if (!topic) {
            throw new Error('Topic is required');
        }

        if (!data) {
            throw new Error('Data is required');
        }
       
        //build timestamp
        let formatted_date = timeStamp();
        //check if id for new post has been used without properly updating and increment until the next value is unique.
        while (postMessages.some(msg => msg.id === (messageId + 1)) || replyMessages.some(msg => msg.id === (messageId + 1))) {
            messageId++;
        }

        postMessages.push({
            id: messageId++,
            topic: topic,
            data: data,
            date: formatted_date
        });

        res.status(201).send({ success: true, id: messageId });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

/*Create a new response, requires "mId" and "data"
//mId = message related to the response
//data = the text response to the post with mId
//Appends post as postMessages[newResponseId] with {relatedPost: mId, id: newResponseId, data: <from parsed body>, date: time stamp}
//Returns {success: true, id: newPostId} or {success: false, message: error.message} 
*/
app.post('/postresponse', (req,res) => {
    try {
        const {mId,data} = req.body;    
        //validating mId is a post and that data isn't empty
        if (!postMessages.some(msg => msg.id === mId)){
            throw new Error("Can't find that post");
        }
        if (!data) {
            throw new Error('Data is required');
        }
        
        //build timestamp
        let formatted_date = timeStamp();

        while (postMessages.some(msg => msg.id === (messageId + 1)) || replyMessages.some(msg => msg.id === (messageId + 1))) {
            messageId++;
        }

        replyMessages.push({
            relatedPost: mId,
            id: messageId++,
            data: data,
            date: formatted_date
        });

        res.status(201).send({ success: true, id: messageId });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

app.listen(PORT,HOST);
console.log('Assignment 3 Server up and running, CTRL+C to shutdown');