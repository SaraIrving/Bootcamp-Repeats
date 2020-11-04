const http = require('http');
const PORT = 8080;

// a function which handles requests and sends response

const requestHandler = function(request, response) {
  console.log('In requestHandler'); // logs last if there is a request

  if (request.url === "/") {
    response.end("Welcome");
  } else if (request.url === "/url") {
    response.end("here are some URLs");
  } else {
    response.statusCode = 404;
    // response.end(`Requested Path: ${request.url} \nRequest Method: ${request.method}`);
    response.end("404 Page Not Found");
  }
  
};

const server = http.createServer(requestHandler);
console.log('Server created'); // logs 1st

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`); // logs 3rd
});

console.log('Last line (after .listen call)'); // logs 2nd
