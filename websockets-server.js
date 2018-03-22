var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic;

console.log('websockets server started');

ws.on('connection', function(socket) {
  console.log('client connection established');

  if (topic) {
    var curr = "*** Topic is ";
    curr += "'" + topic + "'";
    socket.send(curr);
  }

  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on('message', function(data) {
    console.log('message received: ' + data);

    if(data.indexOf("/topic") != -1) {
      var newTopic = "*** Topic has been changed to ";
      // get the data after topic_ till the end of the message
      newTopic += "'" + data.substring(7, data.length) + "'";
      //keep track of topic
      topic = data.substring(7, data.length);

      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(newTopic);
      });
    }


    messages.push(data);
    ws.clients.forEach(function(clientSocket) {
      clientSocket.send(data)
    });

    // previous implementation to send data to main chat
    // socket.send(data);
  });
});
