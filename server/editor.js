var fs = require('fs'),
    path = require('path');

function Editor(){

  this.create = function(socketIO){    
    this.io = socketIO;
    return this;
  };

  this.open = function(id){
    this.io.of('/editor/'+id).on('connection', function(socket){
      // console.log('connect');
      socket.emit('id', socket.id);

      this.fileName = 'server/editor/sessions/'+ id;
      
      path.exists(this.fileName, function(exists){
        if(exists){
          fs.readFile(this.fileName, 'utf8', function(err,data){
            socket.emit('openFile', {sender: socket.id, fileData: data});  
          })    
        } else {
          fs.writeFile(this.fileName,null,'utf8',function(err){
            if(err) throw err;
          });
        }         
      }.bind(this))
      

      socket.on('edit', function (data) {
        // console.log('===edit:',data);
        if(this[data.action]) { this[data.action].call(this, data); }
        socket.broadcast.emit('update', {sender: socket.id, data: data});
      }.bind(this));

      socket.on('save', function(data){
        fs.writeFile(this.fileName, data);
      }.bind(this));
    }.bind(this));

    this.io.of('/editor/'+id).on('disconnect', function(socket){
      console.log('disconnect');
    })
    return this;
  };

  var getPosition = function(str, row, column){
    const NEWLINE = '\n';

    var lines = str.split(NEWLINE),
        pos = 0;

    for(var idx=0, len = lines.length; idx < len; idx++){
      if(row === idx){
        pos += column;
        idx = lines.length;
      }  else {
        pos += lines[idx].length+1;
      }
    }   
    return pos;        
  };

  this.insertText = function(data){
    var range = data.range,
        lines = data.lines, 
        text = data.lines ? data.lines.join('\n') : data.text;

    fs.readFile(this.fileName, 'utf8', function(err, fileData){
      var pos = getPosition(fileData, range.start.row, range.start.column);
  
      // console.log('====',pos);
      var file = fs.createWriteStream(this.fileName, {
        flags: 'a+',
        mode: 0666,
        encoding: 'utf8',
        start: pos
      });
      file.write(text);
      file.end();
    }.bind(this));
  };

  this.removeText = function(data){
    var range = data.range,
        lines = data.lines, 
        text = data.lines ? data.lines.join('\n') : data.text;

    fs.readFile(this.fileName, 'utf8', function(err, fileData){
    
      var startPos = getPosition(fileData, range.start.row, range.start.column),
          endPos = getPosition(fileData, range.end.row, range.end.column),
          begin = fileData.substring(0,startPos),
          end = fileData.substring(endPos);

      // console.log('===pos:',startPos, endPos);
      // console.log('===begin:',begin);
      // console.log('===end:',end);
      fs.writeFile(this.fileName, begin+end, function(err){
        if(err) throw err;
      });

    }.bind(this));
  };

  this.insertLines = this.insertText;
  this.removeLines = this.removeText;
};

module.exports = Editor;