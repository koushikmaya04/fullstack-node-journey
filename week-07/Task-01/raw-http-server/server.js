const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  res.writeHead(200, {
    "Content-Type": "text/plain",
  });

  res.end("Hello from raw HTTP server!");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
