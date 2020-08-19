
require('dotenv').config();

const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');
const socket = require('socket.io');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

const server = app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});

const io = socket(server);
const users = [];
io.on('connection', socket => {
  console.log('made socket connection: ', socket.id);
  socket.emit('id', socket.id);
  //users.push(socket.id);
  console.log('1', socket);

  // io.emit('this', {will: 'be received by all'});
  console.log('2');

  socket.on('addUser', (userID) => {
      users.push({id: userID, sID: socket});
      console.log('zmoney');
      console.log({users});
  });
  console.log('3');

  socket.on('JoinRoom', info => {
    console.log("ROOM INFO: "+ info.room, info.targetId);
    //socket.broadcast.emit('typing', {'handle': info.handle, 'typing': info.isTyping});
    socket.join(info.room);
    //search to see if the targetId (the targeted user we're trying to chat with) is in our users array (aka, is online)
    const targetSocket = users.find(obj => obj.id === targetId);
    //if not undefined then that means they were found in the array
    if (targetSocket !== undefined) {
      targetSocket.join(info.room);
      socket.emit('connectionMade', info.targetId);
    }
    else {
      socket.emit('connectionLost', info.targetId);
    }
  })

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
    users.find((obj, i) => {
      if (obj.sID === socket.id) {
        users.splice(i,1);
      }
    });
    console.log('disconnected');
    console.log({users})
  });

});