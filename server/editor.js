
function Editor(){}

Editor.prototype.init = function(webServer){
    
var io = require('socket.io').listen(webServer);

io.sockets.on('connection', function (socket) {
  socket.emit('id', socket.id);
  socket.on('edit', function (data) {
    socket.broadcast.emit('update', {sender: socket.id, data: data});
  });
});
};

module.exports = Editor;