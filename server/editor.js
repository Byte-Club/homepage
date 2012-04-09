var socketio = require('socket.io');

    
var Editor = {  
  init: function(webServer){    
    this.io = socketio.listen(webServer);
    this.io.sockets.on('connection', function (socket) {
      socket.emit('id', socket.id);
      socket.on('edit', function (data) {
        socket.broadcast.emit('update', {sender: socket.id, data: data});
      });
    });
  }
}

module.exports = Editor;