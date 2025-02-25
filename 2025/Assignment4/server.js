const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "nimad54321"
});

app.get("/init", (req, res) => {
  let sql = "CREATE DATABASE postdb";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);

    let useDBSql = "USE postdb";
    connection.query(useDBSql, (err, result) => {
      if (err) throw err;
      console.log(result);

      let postsSql = "CREATE TABLE posts(id int AUTO_INCREMENT, topic VARCHAR(255), data VARCHAR(255), PRIMARY KEY (id))";
      connection.query(postsSql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Database, postdb and posts table created.");

        let responsesSql = "CREATE TABLE responses( id int AUTO_INCREMENT, data VARCHAR(255), "
      });
    });
  });
});

connection.connect(function(err) {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});


////////////////////////////////////////////Endpoints////////////////////////////////////////////
/* ** POST method **
/postmessage
-input: Accepts {topic,data} from client
-process: Inserts a new record into the posts table with an auto-generated unique ID and a timestamp
-Output: returns a JSON response {success: true, id: newPostId}
*/
app.post("/save", function(req, res) {
  const topic = req.body.topic;
  const data = req.body.data;

  const sql = "INSERT INTO posts (topic, data) VALUES (?, ?)";
  connection.query(sql, [topic, data], function(err) {
    if (err) {
      console.error("Error inserting post:", err);
      return res.status(500).json({ error: "Failed to create post." });
    }
    res.json({ success: true, id: newPostId });
  });
});

/* ** POST method **
/postresponse
-input: Accepts postId and data
-process: Inserts a new record into the responses table.  Validate that the provided postId exists in the posts table
-output: Returns a JSON response {success: true, id: newResponseId}
*/
app.get("/postresponse", function(req, res) {
  const sql = "INSERT INTO responses (postId, data) VALUES (?,?)";
  connection.query(sql, [postId, data], function(err) {
    if (err) {
      console.error("Error inserting response:", err);
      return res.status(500).json({error: "Failed to create response."});
    }
    res.json({success: true, id: newResponseId});
  });
});
/* ** GET method **
/alldata
-purpose: retrieve all posts along with their corresponding responses.
-implementation: May use JOIN queries or perform separate queries to fetch and combine the data.
*/
app.get("/readPosts", function(req, res) {
  const sql = "SELECT * FROM posts";
  connection.query(sql, function(err, result) {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Failed to fetch posts." });
    }
    let output = "";
    result.forEach(function(post) {
      output += "<h3>" + post.topic + "</h3><p>" + post.data + "</p>";
    });
    res.send(output);
  });
});

const port = 3000;
app.listen(port, function() {
  console.log(`Server listening on port ${port}.`);
});
