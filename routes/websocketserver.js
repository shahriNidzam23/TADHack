"use strict";
var express = require('express');
var router = express.Router();

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';
// Port where we'll run the websocket server
var webSocketsServerPort = 90;
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Global variables
 */
// latest 100 messages
var history = [];
// list of currently connected clients (users)
var clients = [];
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
  return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');

  var connection = request.accept(null, request.origin); 

  var index = clients.push(connection) - 1;
  console.log((new Date()) + ' Connection accepted.');

  // send back chat history
  if (history.length > 0) {
    connection.sendUTF(
        JSON.stringify({ type: 'history', data: history} ));
  }

  // user sent some message
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
        var mess = JSON.parse(message.utf8Data);
        console.log(mess);
       // log and broadcast the message
        // console.log((new Date()) + ' Received Message from '
        //             + userName + ': ' + message.utf8Data);
        
        // we want to keep history of all sent messages
        var obj = mess;
        obj.type = "mobile";

        history.push(obj);
        // history = history.slice(-100);

        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: obj });
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
    }
  });
  // user disconnected
  connection.on('close', function(connection) {
      console.log((new Date()) + " Peer " + " disconnected.");
  });
});


module.exports = router;