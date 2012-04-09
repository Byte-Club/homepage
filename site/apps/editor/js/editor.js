var Editor = Ember.Object.create({
  openFile: function(fileName){
    $.ajax({
      url: '/editor/open',
      type: 'POST',
      data: { fileName: fileName },

      success: function(data, status, xhr){
        $('#editor').text(data);
        Editor.initEditor();
        // console.log(typeof data);
        // setTimeout(function(editor){
          // this.aceEditor.getSession().setValue(data);   
        // }, 1, this)
      }.bind(this)
    })
  },

  saveFile: function(fileName){
    //TODO: save to server
  },

  initEditor: function(){
    this.aceEditor = ace.edit("editor");
    this.aceEditor.getSession().setMode("ace/mode/javascript");
    this.aceEditor.getSession().setTabSize(2);
    this.aceEditor.getSession().setUseSoftTabs(true);
    this.aceEditor.setHighlightActiveLine(false);
    this.aceEditor.getSession().on('change', function(evt){
      if(!evt.remote){
        socket.emit('edit', evt.data);  
      }
    });
  }
});

Editor.initEditor();


socket.on('id', function(id){
  Editor.socketID = id;
});

socket.on('update', function(update){
  if(update.sender === Editor.socketID){ return; }
  Editor.aceEditor.getSession().doc.applyDeltas([update.data], true);
});
