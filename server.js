var webServer = require('express').createServer();
webServer.listen(3005);
webServer.get('/', function(request, response){
    response.sendfile(__dirname + '/site/index.html');
});
