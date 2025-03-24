import * as http from 'http';

function requestHandler(req, res) {

  if (req.url === '/hello-world.txt') {
    res.write('Hello World!');
  } else {
    res.statusCode = 404;
    res.write('not found');
  }
  res.end();
}

// create a server that uses our requestHandler
const server = http.createServer(requestHandler);


server.listen(8080);