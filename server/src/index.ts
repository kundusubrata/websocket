import WebSocket, { WebSocketServer , WebSocket as WSClient} from 'ws';
import http, { IncomingMessage, ServerResponse } from 'http';

const server = http.createServer(function(request: IncomingMessage, response: ServerResponse) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.end("Hi there");
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws:WSClient, req:IncomingMessage) => {
  console.log(`${new Date()} Connection established from ${req.socket.remoteAddress}`);

  ws.on('error', (error) => {
      console.error("WebSocket error:", error);
  });

  ws.on('message', (data: WebSocket.Data, isBinary: boolean) => {
      console.log("Received message:", data);
      wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(data, { binary: isBinary });
          }
      });
  });

  ws.send('Wellcome to websocket!!');
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});