'use strict';
const path = require('path');
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const port = 3000;
let lastUpdateTimestamp = Date.now();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "nimad54321"
});

function InitDB(){
  let createPostDB = "CREATE DATABASE postdb";
  connection.query(createPostDB, (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log("Database postdb created.");
  UsePostDB();
  let createPostsTable = "CREATE TABLE posts(id int AUTO_INCREMENT NOT NULL, timeStamp datetime default CURRENT_TIMESTAMP, topic VARCHAR(255) NOT NULL, data VARCHAR(2550) NOT NULL, PRIMARY KEY (id))";
        connection.query(createPostsTable, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table posts created.");
        });
        let createReplyTable = "CREATE TABLE reply(id int AUTO_INCREMENT NOT NULL, timeStamp datetime default CURRENT_TIMESTAMP, data VARCHAR(2550) NOT NULL, postId INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (postId) REFERENCES posts(id))";
        connection.query(createReplyTable, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table Reply created.");
        });
  });
}

//For consistent access to postdb 
function UsePostDB(){
  let useDBSql = "USE postdb";
  connection.query(useDBSql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
}

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
  return `${curr_year}-${curr_month}-${curr_date} ${curr_hour}:${curr_min}:${curr_sec}`;
}

try{
  let checkDBSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'postdb'";
    connection.query(checkDBSql, (err, dbResult) => {
      if (err) throw err;
      console.log(dbResult);
    
      if (dbResult.length > 0) {
        let checkTableSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
        connection.query(checkTableSql, (err, tableResult) => {
        if (err) throw err;
        console.log(tableResult);})
      } else {
        InitDB();
      }
    console.log("Databse postdb found.");
});} catch {
  InitDB();
  UsePostDB();
  console.log("initdb && usepostdb");
}

app.get('/', (req,res,next) => {
  res.sendFile(path.join(__dirname, 'posting.html'));
});

app.get("/init", (req, res) => {
  try{
    let checkDBSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'postdb'";
    connection.query(checkDBSql, (err, dbResult) => {
      if (err) throw err;
      console.log(dbResult);
      
      if (dbResult.length > 0) {
        let checkTableSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE   TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
        connection.query(checkTableSql, (err, tableResult) => {
        if (err) throw err;
        console.log(tableResult);})
      } else {
        InitDB();
      }
      console.log("Databse postdb found.");
  });} catch {
    InitDB();
    UsePostDB();
    console.log("initdb && usepostdb");
  }
});

app.get('/lastupdate',(req,res) => {
  res.json({timestamp: lastUpdateTimestamp});
})
////////////////////////////////////////////Endpoints////////////////////////////////////////////
/* postmessage ** POST method **
-input: Accepts {topic,data} from client
-process: Inserts a new record into the posts table with an auto-generated unique ID and a timestamp
-Output: returns a JSON response {success: true, id: newPostId}
*/
app.post("/postmessage", function(req, res) {
  UsePostDB();
  const topic = req.body.topic;
  const data = req.body.data;

  const sql = "INSERT INTO posts (topic, data) VALUES (?, ?)";
  connection.query(sql, [topic, data], function(err, result) {
    if (err) {
      console.error("Error inserting post:", err);
      return res.status(500).json({ error: "Failed to create post." });
    }
    const newPostId = result.insertId;
    res.json({ success: true, id: newPostId });
    lastUpdateTimestamp = Date.now();
  });
});

/* postresponse ** POST method **
-input: Accepts postId and data
-process: Inserts a new record into the responses table.  Validate that the provided postId exists in the posts table
-output: Returns a JSON response {success: true, id: newResponseId}
*/
app.post("/postresponse", function(req, res) {
  UsePostDB();
  const postId = req.body.postId;
  const data = req.body.data;

  const sql = "INSERT INTO reply (postId, data) VALUES (?,?)";
  connection.query(sql, [postId, data], function(err, result) {
    if (err) {
      console.error("Error inserting response:", err);
      return res.status(500).json({error: "Failed to create response."});
    }
    const newResponseId = result.insertId;
    res.json({success: true, id: newResponseId});
    lastUpdateTimestamp = Date.now();
  });
});

/* alldata ** GET method **
-purpose: retrieve all posts along with their corresponding responses.
-implementation: May use JOIN queries or perform separate queries to fetch and combine the data.
*/
app.get("/alldata", function(req, res) {
  UsePostDB();
  const getPosts = "SELECT * FROM posts";
  const getResponses = "SELECT * FROM reply";
  
  connection.query(getPosts, function(err, posts) {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Failed to fetch posts." });
    }
    
    connection.query(getResponses, function(err, responses) {
      if (err) {
        console.error("Error fetching responses:", err);
        return res.status(500).json({ error: "Failed to fetch responses." });
      }
      
      const postMessages = posts.map(post => {
        return {
          id: post.id,
          topic: post.topic,
          data: post.data,
          timestamp: post.timeStamp
        };
      });
      
      const replyMessages = responses.map(response => {
        return {
          id: response.id,
          postId: response.postId,
          data: response.data,
          timestamp: response.timeStamp
        };
      });
      
      res.json({ postMessages, replyMessages });
    });
  });
});

app.listen(port, function() {
  console.log(`Server listening on port ${port}.`);
});
