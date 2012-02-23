var webServer = require('express').createServer();
webServer.listen(3005);

webServer.get('/assets/*', function(request, response){
    //forward assests requests to site/assets folder
    //request.params[0] is the requested filename
    response.sendfile(__dirname + '/site/assets/' + request.params[0]);
});

webServer.get('*', function(request, response){
    response.sendfile(__dirname + '/site/index.html');
});
