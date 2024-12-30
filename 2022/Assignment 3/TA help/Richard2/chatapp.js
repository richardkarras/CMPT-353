const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydatabase"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

app.post("/save", function(req, res) {
  const topic = req.body.topic;
  const data = req.body.data;

  const sql = "INSERT INTO posts (topic, data) VALUES (?, ?)";
  connection.query(sql, [topic, data], function(err, result) {
    if (err) throw err;
    res.json({ message: "Post created." });
  });
});

app.get("/readPosts", function(req, res) {
  const sql = "SELECT * FROM posts";
  connection.query(sql, function(err, result) {
    if (err) throw err;
    let output = "";
    result.forEach(function(post) {
      output += "<h3>" + post.topic + "</h3><p>" + post.data + "</p>";
    });
    res.send(output);
  });
});

app.listen(3000, function() {
  console.log("Server listening on port 3000.");
});
