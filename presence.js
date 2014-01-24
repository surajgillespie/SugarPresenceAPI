  var socket;

  function SugarPresence() {

  }

  SugarPresence.prototype.joinNetwork = function (nickname, colour, callback) {

      socket = new WebSocket('ws://localhost:8039');
      console.log('Created socket');

      socket.onerror = function (error) {
          console.log('WebSocket Error: ' + error);
      };

      callback("userid");

  }

  SugarPresence.prototype.leaveNetwork = function () {
      socket.close();
      console.log('Socket closed');
  }

  SugarPresence.prototype.onConnectionOpen = function (callback) {
      socket.onopen = function (event) {
          callback(event);
      };
  }

  SugarPresence.prototype.onDataReceived = function (callback) {
      socket.onmessage = function (event) {
          callback(event);
      };
  }

  SugarPresence.prototype.onConnectionClose = function (callback) {
      socket.onclose = function (event) {
          callback(event);
      };
  }

  SugarPresence.prototype.sendMessage = function (group_id, data) {
      console.log(data);
      socket.send(data);
  }

  /*
  function listUsers()
  {
    //
    //*code 
    return ("Connected Users");
  }*/