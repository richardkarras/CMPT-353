const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('<h1> Hello Ralph </h1>');
  
}); 


app.route('/books/scifi')
.get((req, res, next) => { res.send('<h1> SCIFI </h1>'); })
.post((req, res, next) => { });

app.route('/books/scifi/:bookid')
.get((req, res, next) => { res.send(`<h1> SCIFI ${req.params.bookid} </h1>`);})
.put((req, res, next) => {});






app.listen(8080);

console.log('up and running');

