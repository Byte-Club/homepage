var Editor = Ember.Object.create({
  openFile: function(fileName, fromRemote){
    // $.ajax({
    //   url: '/editor/open',
    //   type: 'POST',
    //   data: { fileName: fileName },

    //   success: function(data, status, xhr){
    //     $('#editor').text(data);
    //     Editor.initEditor();
    //     if(!fromRemote){
    //       socket.emit('fileOpened', fileName);        
    //     }        
    //   }.bind(this)
    // })
  },

  saveFile: function(){
    socket.emit('save', Editor.aceEditor.getSession().getValue());
  },

  newSession: function(editorID){
    if(editorID){
      Editor.openFile(editorID);
    } else {
      this.initEditor();
    }
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
        socket.emit('save', Editor.aceEditor.getSession().getValue());  
      }
    });
  }
});

// var editorID = window.location.pathname.split('/')[2];
Editor.initEditor();


socket.on('id', function(id){
  Editor.socketID = id;
});

socket.on('update', function(update){
  if(update.sender === Editor.socketID){ return; }
  Editor.aceEditor.getSession().doc.applyDeltas([update.data], true);
});

socket.on('openFile', function(data){
  $('#editor').text(data.fileData);
  Editor.initEditor();
});
