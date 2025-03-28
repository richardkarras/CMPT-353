const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "admin"
});

const app = express();

app.use(express.json());
app.use(require("cors")());

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
  res.sendFile('/usr/src/app/index.html');
})
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

let useDBSql = "USE postdb";
connection.query(useDBSql, (err, result) => {
if (err) throw err;
console.log(result);
});

function reInitTable (){
  let command="drop table posts;"
        connection.query(command, (err) => {
          if (err) throw err;
          let postsSql = "CREATE TABLE posts(id int AUTO_INCREMENT NOT NULL, topic VARCHAR(255) NOT NULL, data VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
          connection.query(postsSql, (err, result) => {
            if (err) throw err;
            console.log(result);
            console.log("Table posts created.");})
        })
}

app.get('/check', (req,res)=>{
  let checkTableSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
      connection.query(checkTableSql, (err, tableResult) => {
      if (err) throw err;
      console.log(tableResult);
      res.send({exists:tableResult.length>0});
  })
})


app.get ('/initialize', (req,res)=>{
  let checkDBSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'postdb'";
  connection.query(checkDBSql, (err, dbResult) => {
    if (err) throw err;
    console.log(dbResult);
  
    if (dbResult.length > 0) {
      let checkTableSql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'postdb' AND TABLE_NAME = 'posts'";
      connection.query(checkTableSql, (err, tableResult) => {
      if (err) throw err;
      console.log(tableResult);

      if (tableResult.length > 0) {
        console.log("Database postdb and table posts already exist. Deleting table entries");
        reInitTable();
        } else {
          let postsSql = "CREATE TABLE posts(id int AUTO_INCREMENT NOT NULL, topic VARCHAR(255) NOT NULL, data VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
        connection.query(postsSql, (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("Table posts created.");
        });
      }
    });
    } else {
    let createDBSql = "CREATE DATABASE postdb";
    connection.query(createDBSql, (err, result) => {
      if (err) throw err;
      console.log(result);
      console.log("Database postdb created.");
    });
  }});


})
  


app.post('/addPost', (req,res) => {
  const topic = req.body.topic;
  const data = req.body.data;
  
  var sql = `INSERT INTO posts (topic, data) VALUES
  (?, ?)`;
  
  connection.query(sql, [topic, data], function (err,result) {
  console.log(err); 
  });
  res.send('Post created'); 
});

app.get('/getPostsHtml', (req, res) => {
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

app.get('/getPosts', (req, res) => {
  let sql = 'SELECT * FROM posts';
  let query = connection.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send({result});
  });
});
