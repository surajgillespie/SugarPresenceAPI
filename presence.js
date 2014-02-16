  function SugarPresence() {
      var socket;
  }

  SugarPresence.prototype.joinNetwork = function(userInfo) {

      this.socket = new WebSocket('ws://localhost:8039');
      console.log('Created socket');

      this.socket.onerror = function(error) {
          console.log('WebSocket Error: ' + error);
      };
  }

  SugarPresence.prototype.leaveNetwork = function() {
      this.socket.close();
      console.log('Socket closed');
  }

  SugarPresence.prototype.onConnectionOpen = function(callback) {
      this.socket.onopen = function(event) {
          callback(event);
      };
  }

  SugarPresence.prototype.onDataReceived = function(callback) {

      this.onMessageReceived(function(message) {
          if (message.type === 'message')
              callback(message.data);
      });

  } //for messages received from users

  SugarPresence.prototype.onMessageReceived = function(callback) {
      this.socket.onmessage = function(event) {

          var edata = event.data;

          try {
              var json = JSON.parse(edata);
          } catch (e) {
              console.log('This doesn\'t look like a valid JSON: ', edata);
              return;
          }

          callback(json);

      };
  } //will be called by functions to retrieve the message send from server

  SugarPresence.prototype.onConnectionClose = function(callback) {
      this.socket.onclose = function(event) {
          callback(event);
      };
  }

  SugarPresence.prototype.sendMessage = function(group_id, mdata) {
      console.log(mdata);
      var sjson = JSON.stringify({
          type: 'message',
          data: mdata
      });
      this.socket.send(sjson);
  }


  SugarPresence.prototype.listUsers = function(group_id, callback) {
      var sjson = JSON.stringify({
          type: 'requestUserList'
      });
      this.socket.send(sjson);

      this.onMessageReceived(function(message) {
          if (message.type === 'responseUserList')
              callback(message.data);
      });
  }
