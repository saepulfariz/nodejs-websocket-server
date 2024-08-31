const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Rute untuk melayani file HTML
// app.use(express.static(path.join(__dirname, "public")));

var port = 8080;

app.get("/", function (req, res) {
  var hostname = req.hostname;

  res.render("index", {
    title: "WebSocket",
    port: port,
    hostname: hostname,
  });
});

app.get("/welcome", function (req, res) {
  var hostname = req.hostname;

  res.render("welcome", {
    title: "WebSocket",
    port: port,
    hostname: hostname,
  });
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  /*
  ws.on('message', message => {
    console.log(`Received message => ${message}`);
    
    // Broadcast ke semua client yang terhubung
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
		  console.log(message);
        // client.send(message);
		client.send(JSON.stringify(message));
      }
    });
  });
  */

  ws.on("message", function message(data, isBinary) {
    console.log(data.toString());
    console.log(JSON.stringify(data));
    console.log(isBinary);
    console.log(`Client has sent us: ${data}`);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log(data);
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log("Server started on port " + port);
});
