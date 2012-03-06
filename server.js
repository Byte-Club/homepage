//include libraries
var path      = require('path'),
    express   = require('express'),
    
//setup webserver object
    webServer = express.createServer();
webServer.listen(3005);


/** forward assests requests to site/assets folder */
webServer.get('/assets/*', function(request, response){
    //request.params[0] is the requested filename
    response.sendfile(__dirname + '/site/assets/' + request.params[0]);
});

/** load the index automatically */
webServer.get('/', function(request, response){
    response.sendfile(__dirname + '/site/index.html');
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


