'use strict';

var express = require('express');
var app = express();

// Define the handler for the root path ('/')
function handleRootRequest(req, res) {
    console.log(req.originalUrl);
    res.send('hello world');
    }

// Define the handler for the '/hello' path
function handleHelloRequest(req, res) {
    console.log(req.originalUrl);
    res.send('hello');
    }

// Define the static file server for the '/web' path
function serveStaticFiles(req, res, next){
    express.static('pages')(req, res, next)
    }

// Route the requests to their respective handlers
app.get('/', handleRootRequest);
app.get('/hello', handleHelloRequest);
app.use('/web', serveStaticFiles);

// Start the server on port 8080
function startServer() {
console.log('Server listening on port 8080');
}
app.listen(8080, startServer);