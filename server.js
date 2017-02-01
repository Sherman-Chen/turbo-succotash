const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;

const users = [];
const connections = [];

server.listen(port, () => {
  console.log(`server is listening on localhost:${port}`);
});

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

app.use(express.static(__dirname + '/client'));

// socket controllers

const updateUsernames = () => {
  io.sockets.emit('get users', users);
};

// on connect
io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Connected, ${connections.length} sockets connected`);

  // on disconnect
  socket.on('disconnect', (data) => {
    // if (!socket.username) {
    //   return;
    // }
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected, ${connections.length} sockets still connected`);
  });

  // send message
  socket.on('send message', (data) => {
    console.log('send message data: ', data);
    io.sockets.emit('new message', {message: data, user: socket.username});
  });

  // new user
  socket.on('new user', (data, callback) => {
    console.log('new user data: ', data);
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

});