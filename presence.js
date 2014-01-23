
 
  var socket;


  function joinNetwork(nickname, colour)
  {
        socket = new WebSocket('ws://localhost:8039');
        console.log('Created socket');
        return socket;     
  }

  function leaveNetwork()
  {
      socket.close();
      console.log('Socket closed');  
  }

  function sendMessage(group_id, data)
  {
    console.log(data);
    socket.send(data);
  }  
  
  function listUsers()
  {
    //
    //*code 
    return ("Connected Users");
  }


