    var callbackArray = []

        function SugarPresence() {
            var socket;

            var that = this;
            var listUsersCallback = function() {};
            var receivedDataCallback = function() {};
            callbackArray = [listUsersCallback, receivedDataCallback]
            this.onMessageReceived = function(callback) {
                this.socket.onmessage = function(event) {

                    var edata = event.data;

                    try {
                        var json = JSON.parse(edata);
                    } catch (e) {
                        console.log('This doesn\'t look like a valid JSON: ', edata);
                        return;
                    }

                    if (json.type < callbackArray.length)
                        callbackArray[json.type](json.data); // Call the matching callback

                };
            } //will be called by functions to retrieve the message send from server
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
        this.onMessageReceived();
        this.socket.onopen = function(event) {
            callback(event);
        };
    }

    SugarPresence.prototype.onDataReceived = function(callback) {
        callbackArray[0] = callback;
        //this.receivedDataCallback = callback;
    } //for messages received from users

    SugarPresence.prototype.onConnectionClose = function(callback) {
        this.socket.onclose = function(event) {
            callback(event);
        };
    }

    SugarPresence.prototype.sendMessage = function(group_id, mdata) {
        console.log(mdata);
        var sjson = JSON.stringify({
            type: 0,
            data: mdata
        });
        this.socket.send(sjson);
    }


    SugarPresence.prototype.listUsers = function(group_id, callback) {
        var sjson = JSON.stringify({
            type: 1
        });
        callbackArray[1] = callback;
        //this.listUsersCallback = callback;
        this.socket.send(sjson);
    }
