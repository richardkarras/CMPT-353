const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('<h1> Hello Ralph </h1>');
  
}); 

app.get('/books/scifi', (req, res, next) => {
    res.send('<h1> SCIFI </h1>');
    
});

app.post('/books/scifi', (req, res, next) => {
    
});

app.get('/books/scifi/:bookid', (req, res, next) => {
    
});

app.put('/books/scifi/:bookid', (req, res, next) => {
    
});






app.listen(8080);

console.log('up and running');

