const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors')
const app = express();

const { 
  tournamentStatusEvent : event 
} = require('./events/tournament-status');

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the origin of your frontend application
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions))

const server = http.Server(app);

const ioV2 = socketIO(server);

server.listen(3334, () => console.log('listening 3334 - io version = 2'))

ioV2.on('connection', (socket) => {
  console.log('socket V2 client succesfully connected');

  setTimeout(() => {
    socket.emit(event.name, event.data)
  }, 5000)

  console.log(`${event.name} has been successfully sent`)
})