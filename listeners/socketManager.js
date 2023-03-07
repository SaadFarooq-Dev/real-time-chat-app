
let users = [];
const socketManager =  (io)=>{
io.on('connection', (socket) => {

  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('message',  (data) => {
     io.emit('messageResponse', data);
  });

  socket.on('typing',  (data) =>  socket.broadcast.emit('typingResponse', data));

  socket.on('newUser', (data) => {
    if(data.username && data.socketID){
      users = users.filter((user) => user.socketID !== data.socketID);
      users.push(data);
      io.emit('newUserResponse', users);
    }
  });

  socket.on('disconnect',  () => {
    users = users.filter((user) => user.socketID !== socket.id);
    io.emit('newUserResponse', users);
    socket.disconnect()
  });
});
}

module.exports = socketManager
