const express = require('express');

const app = express();

function myFunction1(req, res, next) {
  res.send('<h1> Hello Ralph 2 </h1>');
   
}

app.get('/', myFunction1);

app.listen(8080);

console.log('up and running');

