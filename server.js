//include libraries
var fs        = require('fs'),
    path      = require('path'),
    express   = require('express'),
    socketio = require('socket.io');

    
//setup webserver object
var webServer = express.createServer();
webServer.use(express.bodyParser());
webServer.listen(3005);

var socketServer = socketio.listen(webServer);


/** forward assests requests to site/assets folder */
webServer.get('/assets/*', function(request, response){
    //request.params[0] is the requested filename
    response.sendfile(__dirname + '/site/assets/' + request.params[0]);
});

/** load the index automatically */
webServer.get('/', function(request, response){
    response.sendfile(__dirname + '/site/index.html');
});


/** load our glossary module */
var glossary = require('./server/glossary');

/** use glossary methods for routes */
webServer.get('/glossary/terms/:term?', glossary.index);
webServer.post('/glossary/terms', glossary.create);
webServer.put('/glossary/terms/:term', glossary.update);



var Editor = require('./server/editor');
var editors = {};


webServer.get('/editor/:id', function(request, response){
  var index = __dirname + '/site/apps/editor/index.html',
      file = __dirname + '/server/editor/sessions/'+ request.params.id;
  
  path.exists(index, function(exists){
    if(exists){
      response.sendfile(index);
      if(!editors[request.params.id]){
        editors[request.params.id] = new Editor().create(socketServer).open(request.params.id);  
      }      
    } else {
      response.send(404);
    }
  });

});

webServer.post('/editor/open', function(request, response){
  var file = __dirname + '/' + request.body.fileName;

  path.exists(file, function(exists){
    if(exists){
     response.sendfile(file);
    } else {
      response.send(404);
    }
  });
});

webServer.post('/editor/save', function(request, response){
  var file = __dirname + '/' + request.body.fileName;

  path.exists(file, function(exists){
    if(exists){
     response.sendfile(file);
    } else {
      response.send(404);
    }
  });
});



/** Generic app resources router */
webServer.get('/:appname', function(request, response){
  var file = __dirname + '/site/apps/' + request.params.appname + '/index.html';
  path.exists(file, function(exists){
    if(exists){
      response.sendfile(file);
    } else {
      response.send(404);
    }
  });
});
webServer.get('/:appname/*', function(request, response){
  var file = __dirname + '/site/apps' + request.url;
  //if the file exists, send it, otherwise 404
  path.exists(file, function(exists){
    if(exists){
      response.sendfile(file);
    } else {
      response.send(404);
    }
  });
});

/** handle all other GET requests */
webServer.get('/:filename.:format?', function(request, response){
  var fmt = request.params.format || 'html', //default to html format
      file = __dirname + '/site/' + request.params.filename +'.' + fmt;

  //if the file exists, send it, otherwise 404
  path.exists(file, function(exists){
    if(exists){
      response.sendfile(file);
    } else {
      response.send(404);
    }
  });
});

