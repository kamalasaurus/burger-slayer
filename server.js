var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.use(express.static('public'));
app.use(express.static('node_modules/peerjs/dist'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/controller", function (request, response) {
  response.sendFile(__dirname + '/views/controller.html');
});

var server = require('http').createServer(app);
var peerserver = ExpressPeerServer(server, {debug: true});

app.use('/peerjs', peerserver);

server.listen(9000);

peerserver.on('connection', function(id) {
  console.log(id);
})

