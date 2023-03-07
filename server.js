require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http').Server(app)
const cors = require('cors')
const io = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:5500"
  }
});
const connectDB = require('./config/db')



const corsOptions = {
  origin: '*',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200
}

// Connect to database
connectDB()

// init Middlewares
app.use(express.json({ extended: false }))
app.use(cors(corsOptions)) // Use this after the variable declaration
let users = [];

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    io.emit('messageResponse', data);
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  socket.on('newUser', (data) => {
    users.push(data);
    io.emit('newUserResponse', users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter((user) => user.socketID !== socket.id);
    io.emit('newUserResponse', users);
    socket.disconnect();
  });
});
app.get('/', (req, res) => {
  res.send('Api Running')
})

const PORT = process.env.PORT || 4000

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
