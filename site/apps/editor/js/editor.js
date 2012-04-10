var Editor = Ember.Object.create({

  socket: io.connect(window.location.pathname),

  online: false,
  queue: [],

  saveFile: function(){
    socket.emit('save', this.aceEditor.getSession().getValue());
  },

  initEditor: function(){
    this.aceEditor = ace.edit("editor");
    this.aceEditor.getSession().setMode("ace/mode/javascript");
    this.aceEditor.getSession().setTabSize(2);
    this.aceEditor.getSession().setUseSoftTabs(true);
    this.aceEditor.setHighlightActiveLine(false);
    this.aceEditor.getSession().on('change', function(evt){
      if(!evt.remote){
        console.log(evt.data);
        if(this.get('online')){
          this.socket.emit('edit', evt.data);            
        } else {
          console.log('saving change to queue');
          this.get('queue').pushObject(evt.data);
        }
        // Editor.saveFile();
      }
    }.bind(this));
  },

  onlineDidChange: function(){
    console.log('onlineDidChange');
    if(this.get('online')){
      clearInterval(this.offlineInterval);
      this.get('queue').forEach(function(evtData){
        this.socket.emit('edit', evtData);       
      }.bind(this));
      //TODO: flush this properly
      this.set('queue', []);
    } 
  }.observes('online'),

  initSocket: function(){
    this.socket.on('id', function(id){
      Editor.socketID = id;
    });

    this.socket.on('update', function(update){
      Editor.aceEditor.getSession().doc.applyDeltas([update.data], true);
    });

    this.socket.on('openFile', function(data){
      $('#editor').text(data.fileData);
      Editor.initEditor();
    });

    this.socket.on('connect', function(){
      console.log('online');
      Editor.set('online', true);

    });

    this.socket.on('reconnect', function(){
      console.log('online');
      Editor.set('online', true);

    });
    this.socket.on('disconnect', function(){
      console.log('offline');
      this.set('online', false);
    }.bind(this));    
  }
});



Editor.initSocket();
Editor.initEditor();