const express = require('express');

const app = express();

const books = require('./routes/books');

app.use('/books', books);


app.get('/', (req, res, next) => {
  res.send('<h1> Hello Ralph </h1>');
  
}); 








app.listen(8080);

console.log('up and running');

