const express = require('express');
const http = require('http');
const socketIO = require('socket.io-latest');
var cors = require('cors')
const app = express();

const { 
  newNotificationEvent : event 
} = require('./events/new-notification');

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the origin of your frontend application
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions))

const server = http.Server(app);

const ioV4 = socketIO(server);

server.listen(3333, () => console.log('listening on 3333 - io version = 4'));

ioV4.on('connection', (socket) => {
  console.log('socket V4 client succesfully connected');

  setTimeout(() => {
    socket.emit(event.name, event.data)
  }, 5000)

  console.log(`${event.name} has been successfully sent`)
});
