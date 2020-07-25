const app = require('./app')
const { PORT } = require('./config');
const socket = require('socket.io');



const server = app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});

const io = socket(server);

io.on('connection', socket => {
  console.log('made socket connection: ', socket.id);
  socket.emit('id', socket.id);

  // io.emit('this', {will: 'be received by all'});



  socket.on('message', (message) => {
    console.log('received message: ',message);
    //io.sockets.emit('message',message)

    socket.broadcast.emit('message',message);
  })

  socket.on('typing', info => {
    console.log("2 - RECEIVED FROM CLIENT");
    console.log("2 - SENDING TO ALL SOCKETS THIS USER: "+ info.handle+ info.isTyping);
    socket.broadcast.emit('typing', {'handle': info.handle, 'typing': info.isTyping});
  })


  socket.on('disconnect',() => {
    io.emit('user disconnected');
    console.log('disconnected');
  });

});