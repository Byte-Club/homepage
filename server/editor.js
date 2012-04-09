var fs = require('fs'),
    path = require('path');

    
var Editor = {  

  create: function(socketIO){    
    this.io = socketIO;
    // this.io.sockets.on('connection', function (socket) {
    //   socket.emit('id', socket.id);
    //   socket.on('edit', function (data) {
    //     socket.broadcast.emit('update', {sender: socket.id, data: data});
    //   });
    //   socket.on('fileOpened', function (fileName) {
    //     socket.broadcast.emit('openFile', {sender: socket.id, fileName: fileName});
    //   });
    // });
    return this;
  },

  open: function(id){
    this.io.of('/editor/'+id).on('connection', function(socket){
      var file = 'server/editor/sessions/'+ id;

      socket.emit('id', socket.id);
      path.exists(file, function(exists){
        if(exists){
          fs.readFile(file, 'utf8', function(err, data){
            socket.emit('openFile', {sender: socket.id, fileData: data});
          });
        } else {
          fs.open(file, 'w+', 0755, function(){});
        }
      })
      socket.on('edit', function (data) {
        socket.broadcast.emit('update', {sender: socket.id, data: data});
      });
      socket.on('fileOpened', function (fileName) {
        socket.broadcast.emit('openFile', {sender: socket.id, fileName: fileName});
      });
      socket.on('save', function(data){
        fs.writeFile(file, data);
      })
    });
  }

}

module.exports = Editor;