const http = require("http");
const request = http.request;
const net = require("net");
const connect = net.connect;

// Create an HTTP tunneling proxy
const proxy = http.createServer();
proxy.on("connect", (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write(
      "HTTP/1.1 200 Connection Established\r\n" +
        "Proxy-agent: Node.js-Proxy\r\n" +
        "\r\n",
    );
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

proxy.on("request", (request, response) => {
  const url = new URL(request.url);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: request.method,
    headers: request.headers,
  };

  console.log(options);

  const req = http.request(options, (res) => {
    let data;
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
      data = data + chunk;
    });
    res.on("end", () => {
      console.log("No more data in response.");
      response.writeHead(res.statusCode, res.headers);
      response.end(data);
    });
  });
  req.end();
});

// Now that proxy is running
proxy.listen(8000, "127.0.0.1", () => {
  console.log("proxy server runing on port 8000");
});
