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

/*Initializes database, selects database and creates posts and reply tables.
//DB: postdb
//Tables: posts, reply
*/
function InitDB(){
  initPostDB();
  UsePostDB();
  initPostsTB();
  initReplyTB();
}

// Initializes postdb
function initPostDB(){
  let createPostDB = "CREATE DATABASE postdb";
  connection.query(createPostDB, (err, result) => {
    if (err) throw err;
    console.log(result);
  console.log("Database postdb created.");
  UsePostDB();
  })
}

/*Initilizes table: posts
//posts:
//  id INT AUTO_INCREMENT NOT NULL
//  timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP
//  topic VARCHAR(255) NOT NULL
//  data VARCHAR(2550) NOT NULL
//  PRIMARY KEY (id)
*/
function initPostsTB(){
  let createPostsTable = "CREATE TABLE posts(id INT AUTO_INCREMENT NOT NULL, timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP, topic VARCHAR(255) NOT NULL, data VARCHAR(2550) NOT NULL, PRIMARY KEY (id))";
    connection.query(createPostsTable, (err, result) => {
      if (err) throw err;
        console.log(result);
      console.log("Table posts created.");
    });
}

/*Initilizes table: reply
//reply:
//  id int AUTO_INCREMENT NOT NULL
//  timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP
//  data VARCHAR(2550) NOT NULL
//  postId INT NOT NULL
//  PRIMARY KEY (id)
//  FOREIGN KEY (postId) REFERENCES posts(id)
*/
function initReplyTB(){
  let createReplyTable = "CREATE TABLE reply(id INT AUTO_INCREMENT NOT NULL, timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP, data VARCHAR(2550) NOT NULL, postId INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (postId) REFERENCES posts(id))";
  connection.query(createReplyTable, (err, result) => {
    if (err) throw err;
      console.log(result);
    console.log("Table Reply created.");
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

/*  init()
// Checks for database: postdb, table: posts and table: reply for creation
// Calls initPostDB() if postdb is not found
// Calls initPostsTB() if tables is not found
// Calls initReplyTB() if reply is not found
*/
function init(res) {
  try {
    let checkDBSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'postdb'";
    connection.query(checkDBSql, (err, dbResult) => {
      if (err) throw err;
      console.log(dbResult);

      if (dbResult.length > 0) {
        UsePostDB();
        let checkPostSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
        connection.query(checkPostSql, (err, postResult) => {
          if (err) throw err;
          console.log(postResult);

          if (postResult.length > 0) {
            let checkReplySql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'reply'";
            connection.query(checkReplySql, (err, replyResult) => {
              if (err) throw err;
              console.log(replyResult);

              if (replyResult.length > 0) {
                res.json({ success: true, message: "Database and tables found." });
              } else {
                initReplyTB();
                res.json({ success: true, message: "Reply table initialized." });
              }
            });
          } else {
            initPostsTB();
            initReplyTB();
            res.json({ success: true, message: "Posts and reply tables initialized." });
          }
        });
      } else {
        InitDB();
        res.json({ success: true, message: "Database initialized." });
      }
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.json({ success: false, message: "Error initializing database." });
  }
}

app.get('/', (req,res,next) => {
  res.sendFile(path.join(__dirname, 'posting.html'));
});

app.get("/init", (req, res) => {
  init(res);
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
  if (!topic && !data) {
    return res.status(400).json({ error: "Topic and Data are empty" });
  }
  if (!topic) {
    return res.status(400).json({ error: "Missing topic" });
  }
  if (!data) {
    return res.status(400).json({ error: "Missing data" });
  }

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
  if (!postId && !data){
    return res.status(400).json({ error: "PostId and Data are empty" });
  }
  if (!postId) {
    return res.status(400).json({ error: "Missing associated postId" });
  }
  if (!data) {
    return res.status(400).json({ error: "Missing reply data" });
  }
  
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
