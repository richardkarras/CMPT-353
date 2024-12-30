const express = require("express");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host        : 'db1',
    user        : 'admin',
    //password    : 'rootpw',
    port        : '3306'     
});

const app = express();

app.listen('8080', () => {
    console.log('Server up and listening on 8080');
});

try {
    connection.connect();
    console.log("postdb connected");
} catch (error) {
    console.log(error)
};


app.get('/init', (req, res) =>{
    let sql = 'CREATE DATABASE postdb';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created.');
    })
});

/*
app.get('/posting', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), data VARCHAR(255), PRIMARY KEY (id)';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Posts table created.');
    });
});

app.get('/post', (req, res) => {
    let post = {title:'Post One', data:'This is test post'}; //TODO: use body-parser to capture posting data.
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post 1 added.');
    });
});

app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('Posts fetched');
    });
});

app.get('/updatepost/:id', (req, res) => {
    let newTitle = 'Updated Title';
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('Post updated');
    });
});

app.get('/deletepost/:id', (req, res) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('Post updated');
    });
});
*/
/*
app.listen('8080', () => {
    console.log('Server up and listening on 8080');
});*/