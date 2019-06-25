var express = require('express');
var app = express();
//var ExpressPeerServer = require('peer').ExpressPeerServer;

app.use(express.static('public'));
//app.use(express.static('node_modules/peerjs/dist'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/controller", function (request, response) {
  response.sendFile(__dirname + '/views/controller.html');
});

var server = require('http').createServer(app);
//var peerserver = ExpressPeerServer(server, {debug: true});

//app.use('/peerjs', peerserver);

server.listen(9000);

//peerserver.on('connection', function(id) {
  //console.log(id);
//});

const io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  console.log(socket.id + 'has connected');
  socket.on('throw_burger', function(data) {
    io.sockets.emit('throw_burger', data);
  });
});

