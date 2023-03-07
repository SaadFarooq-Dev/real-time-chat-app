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
const socketManager = require('./listeners/socketManager')

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

//handle socket
socketManager(io)

app.get('/', (req, res) => {
  res.send('Api Running')
})
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/login'))


const PORT = process.env.PORT || 4000

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
