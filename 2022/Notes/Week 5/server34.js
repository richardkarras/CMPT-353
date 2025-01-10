const express = require('express');

const app = express();

app.use(mw1);
app.use(mw2);

function mw1(req, res, next) {
  console.log('mw1');
  next();
}

function mw2(req, res, next) {
    console.log('mw2');
    next();
  }

function myFunction1(req, res, next) {
  console.log('myFunction1');
  res.send('<h1> Hello Ralph 2 </h1>');
   
}

app.get('/',  myFunction1);

app.listen(8080);

console.log('up and running');

