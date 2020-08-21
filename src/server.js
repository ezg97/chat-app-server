
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

// LISTENING: for first connection.
io.on('connection', socket => {
  console.log('made socket connection: ', socket.id);
  socket.emit('id', socket.id);

  // LISTENING: for adding a user to the user array with an {id and socket}
  socket.on('addUser', (userID) => {
      // There can be multiple elements in the array with the same id, but different sockets that way the user can chat with multiple tabs open
      users.push({id: userID, userSocket: socket});
      console.log('USER ADDED');
      console.log({users});
  });
  console.log('3');

  // LISTENING: for a socket trying to join a room.
    // Operation: Locate the socket we're trying to connect to in the 'users' array
    // If the user exists and they haven't joined the group yet, force them to join, then add the user who sent this request into the group and send message back to client

  socket.on('JoinRoom', info => {
    console.log("ROOM INFO: " + info.room, info.targetId);
    
    // Find the user object in the user array - The user the requestor is trying to connect to
    const targetUserArray = users.filter(obj => obj.id === info.targetId);
    // Find the user object in the user array - The user that sent in this request
    const myUserArray = users.filter(obj => obj.id === info.myId);

    console.log('ALL of my users accounts',myUserArray);console.log('ALL the target users accounts',targetUserArray);

    // If the requested user has an array with length, then they are online
    if (targetUserArray.length > 0) {
                  console.log('making...');

      // Access all the objects that correspond with the requested user's id and add them into the group.
      targetUserArray.forEach(obj => {
        let socketRooms = obj.userSocket.rooms;

        console.log('hulu checking: ');console.log('rooms: ',socketRooms[info.room]);console.log('id: ', obj.userSocket.id);

        // Add the requested user to the room only if it hasn't been added already
        if (!socketRooms[info.room]) {
          //The socket is added to a room only once
          socket.join(info.room);
          console.log('joined');
          obj.userSocket.join(info.room);
          console.log('CONNECTION MADE');console.log(obj.userSocket.id);
          // Emit back to client that the connection was made.
          socket.emit('connectionMade', info.room, obj.userSocket.id);
        }

        // Add the user who sent this request in to the room (must be an extra tab from the original)
        if (!socket.rooms[info.room]) {
          socket.join(info.room);
          console.log('joined (diff account)');
          console.log('-> ', socket[info.room])
          socket.emit('connectionMade', info.room, obj.userSocket.id);
        }
          
      })
    }
    else {
      //tell the client that this user is offline and we can't contact them right now
      console.log('CONNECTION LOST');
      //for the moment, if the user can't connect to the room, I don't know if I should dele
     socket.emit('connectionLost', info.targetId);
    }
  })

  //LISTENING: for message from client to disperse to other users
  socket.on('message', (info) => {
    console.log('received message: ',info.msg);
    let message = info.msg;
    //io.sockets.emit('message',message)
    console.log('room for message', info.room)

    socket.to(info.room).emit('message',message)
    // socket.broadcast.emit('message',message);
  })

  //LISTENING: for typing from client to disperse to other users
  socket.on('typing', info => {
    console.log("2 - RECEIVED FROM CLIENT");
    console.log("2 - SENDING TO ALL SOCKETS THIS USER: "+ info.handle+ info.isTyping);
    // socket.broadcast.emit('typing', {'handle': info.handle, 'typing': info.isTyping});
    socket.to(info.room).emit('typing', {'handle': info.handle, 'typing': info.isTyping});

  })


  //LISTENING: for disconnection from client to disperse to other users
  socket.on('disconnect',() => {
    io.emit('user disconnected');
    //Remove this user from the array if they have disconnected
    console.log({users});
    console.log(users[users.length-1]);
    console.log(users[users.length-1].userSocket.id);
    users.find((obj, i) => {
      if (obj.userSocket.id === socket.id) {
        console.log('deleting user,',obj.userSocket.id);
        users.splice(i,1);
        console.log({users});
        console.log('index:',i,'length:',users.length);
        return true; //if something isn't returned then find() will keep iterating and throw an error
      }
    });
    console.log('disconnected');
    console.log({users})
  });

});


  // io.emit('this', {will: 'be received by all'});
