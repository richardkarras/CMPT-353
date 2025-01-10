const express = require('express');

const app = express();

app.use(mw1);
app.use(mw2);


function mw1(req, res, next) {
    req.myprop = "myprop";
  console.log('mw1');
  next();
}

function mw2(req, res, next) {
    console.log('mw2');

    const err = new Error('Something went wrong');
    next();
  }

function mw3(req, res, next) {
    console.log('mw3');
    next();
  }

  function errFunction(err, req, res, next) {
    if (err) {
        res.send("<h1> Error: " + err.message + "</h1>");
    };
    console.log('errFunction');
    next();
  }

function myFunction1(req, res, next) {
  console.log('myFunction1');
  console.log(`custom prop is: ${req.myprop}`);

  res.send('<h1> Hello Ralph 2 </h1>');
   
}

app.get('/',  mw3, myFunction1);

app.use(errFunction);

app.listen(8080);

console.log('up and running');

