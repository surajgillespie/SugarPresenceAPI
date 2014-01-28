  var socket;

  function SugarPresence() {

  }

  SugarPresence.prototype.joinNetwork = function (userInfo, callback) {

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

  SugarPresence.prototype.sendMessage = function (group_id, mdata) {
      console.log(mdata);
      var sjson = JSON.stringify({
          type: 'message',
          data: mdata
      });
      socket.send(sjson);
  }


  SugarPresence.prototype.listUsers = function () {
      var sjson = JSON.stringify({
          type: 'requestUserList'
      });
      socket.send(sjson);
  }
