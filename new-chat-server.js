// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 8039;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// latest 100 messages
// list of currently connected clients (users)
var clients = [];


/**
 * HTTP server
 */
var server = http.createServer(function (request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function (request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    var connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    var userName = false;

    console.log((new Date()) + ' Connection accepted.');



    // user sent some message
    connection.on('message', function (message) {
        if (message.type === 'utf8') { // accept only text
            if (userName === false) { // first message sent by user is their name
                // remember user name
                //userName = message.utf8Data;
                var rjson = JSON.parse(message.utf8Data);
                userName = rjson.data;
                clients[index][0] = userName;
                //connection.sendUTF(userName);
                connection.sendUTF(JSON.stringify({
                    type: 'first',
                    data: userName
                }));
                console.log((new Date()) + ' User is known as: ' + userName);

            } else { // log and broadcast the messages
                console.log((new Date()) + ' Received Message from ' + userName + ': ' + message.utf8Data);

                console.log(clients.length + " user/s are connected")
                console.log("Connected clients");

                var connectedUsernames = [];

                //storing all connected clients in connectedUserNames
                for (var i = 0; i < clients.length; i++) {
                    connectedUsernames[i] = clients[i][0];
                    console.log(clients[i][0]);
                }

                var rjson = JSON.parse(message.utf8Data);

                if (rjson.type === 'requestUserList') {
                    connection.sendUTF(JSON.stringify({
                        type: 'responseUserList',
                        data: connectedUsernames
                    }));
                } else if (rjson.type === 'message') {
                    // broadcast message to all connected clients
                    //var json = JSON.stringify({ type:'message', data: obj });
                    console.log("Just a message");
                    var obj = {
                        author: userName,
                        text: rjson.data,
                    };

                    // broadcast message to all connected clients
                    var json = JSON.stringify({
                        type: 'message',
                        data: obj
                    });
                    connection.sendUTF(json);
                }
            }
        }

    });

    // user disconnected
    connection.on('close', function (connection) {
        if (userName !== false) {
            console.log((new Date()) + " Peer " + userName + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
            // push back user's color to be reused by another user

        }
    });

});