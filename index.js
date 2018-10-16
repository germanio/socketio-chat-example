const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.send('<h1>Hello World!</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.broadcast.emit('a user connected');

  socket.on('chat message', (msg) => {
    console.log(`${msg.user} wrote: ${msg.text}`);
    io.emit('chat message', msg);
  });

  socket.on('nick set', (nickChange) => {
    console.log(`${nickChange.oldNick} set a new nick: ${nickChange.newNick}`);
    socket.broadcast.emit('nick set', nickChange);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    socket.broadcast.emit('a user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});