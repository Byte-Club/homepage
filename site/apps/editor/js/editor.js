var Editor = Ember.Object.create({ 

  options: {
    value: "function myScript(){return 100;}\n",
    mode:  "javascript",
    lineNumbers: true,
    tabSize: 2, 

    onChange: function(instance, tc, user){
      console.log('onChange:', tc.text);
      socket.emit('edit', tc);

      //TODO: send to server
    }
  }

});

Editor.codeMirror = CodeMirror(document.body, Editor.options);

socket.on('id', function(id){
  console.log(id);
  Editor.socketID = id;
});

socket.on('update', function(update){
  if(update.sender === Editor.socketID){ return;}
  var data = update.data;

  Editor.codeMirror.replaceRange(data.text.join(''), data.from, data.to);
  // Editor.codeMirror.onChange = Editor.codeMirror._onChange;

})