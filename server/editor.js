var socketio = require('socket.io'),
    path = require('path');

    
var Editor = {  
  init: function(webServer){    
    this.io = socketio.listen(webServer);
    this.io.sockets.on('connection', function (socket) {
      socket.emit('id', socket.id);
      socket.on('edit', function (data) {
        socket.broadcast.emit('update', {sender: socket.id, data: data});
      });
      socket.on('fileOpened', function (fileName) {
        socket.broadcast.emit('openFile', {sender: socket.id, fileName: fileName});
      });
    });
  },

  open: function(request, response){
    var file = __dirname + '/../' + request.body.fileName;

    console.log(file);

    path.exists(file, function(exists){
      if(exists){
       response.sendfile(file);
      } else {
        response.send(404);
      }
    });
  }
}

module.exports = Editor;