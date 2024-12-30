const express = require("express");
const bodyParser = require("body-parser");
var mysql = require("mysql");


var connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "admin"
});

const app = express();

app.listen("8080", () => {
  console.log("Server up and listening on 8080");
});

try {
  connection.connect();
  console.log("mysql connected");
} catch (err) {
  console.log(err);
}

app.get('/', (req, res, next) => {
  let useDBSql = "USE postdb";
    connection.query(useDBSql, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  res.sendFile('/usr/src/app/posting.html');
})
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

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
      });
    });
  });
});

app.get('/testpost', (req, res) => {
    let post = {topic:'Post One', data:'This is test post'}; //TODO: use body-parser to capture posting data.
    let sql = 'INSERT INTO posts SET ?';
    let query = connection.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post 1 added.');
    });
});

app.post('/addPost', (req,res) => {
  const topic = req.body.topic;
  const data = req.body.data;
  
  var sql = `INSERT INTO posts (topic, data) VALUES
  (?, ?)`;
  
  connection.query(sql, [topic, data], function (err,result) {
  console.log(err); 
  });
  res.send('ok '); 
});

app.get('/getPosts', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        let output = "";
        result.forEach(function(post) {
          output += "<h3>" + post.topic + "</h3><p>" + post.data + "</p>";
        });
        console.log(result);
        res.send(output);
    });
});