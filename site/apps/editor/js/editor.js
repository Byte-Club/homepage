var Editor = Ember.Object.create({
});

Editor.aceEditor = ace.edit("editor");
Editor.aceEditor.getSession().setMode("ace/mode/javascript");
Editor.aceEditor.getSession().setTabSize(2);
Editor.aceEditor.getSession().setUseSoftTabs(true);
Editor.aceEditor.setHighlightActiveLine(false);

Editor.aceEditor.getSession().on('change', function(evt){
  if(!evt.remote){
    socket.emit('edit', evt.data);  
  }
});

socket.on('id', function(id){
  Editor.socketID = id;
});

socket.on('update', function(update){
  if(update.sender === Editor.socketID){ return; }
  Editor.aceEditor.getSession().doc.applyDeltas([update.data], true);
});
