const http = require('http');
function index (request, response){
    response.writeHead(200);
    response.end('Hello, World 123!');
}
http.createServer(function (request, response){

    if (request.url === '/' {
        return index(request, response);
    })
})