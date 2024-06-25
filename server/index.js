/*const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log(socket.id);
        var d={message:data,UserId:socket.id,Name:data.UserName};
        console.log(d);
      io.emit("receive_message",d);
    });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
*/
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require('path');
const fs = require('fs')

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log(socket.server);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.server.in(data.room).emit("receive_message", data);
  });

  socket.on('audioData', (data) => {
    console.log('Audio data received');
    // Convert Blob to Buffer
    const buffer = Buffer.from(new Uint8Array(data));

    // Create a writable stream and write the buffer to a file
    const filePath = path.join(__dirname, `audio_${Date.now()}.webm`);
    fs.writeFile(filePath, buffer, (err,data1) => {
      if (err) {
        console.error('Error writing audio file', err);
      } else {
        console.log('Audio file saved:', filePath);
      }

      socket.server.in(data.room).emit('audioData', { audio: buffer });
    });
  });


  socket.on('videoData', (data) => {
    console.log("check")
    console.log(data)
    const buffer = Buffer.from(new Uint8Array(data));
    const filePath = path.join(__dirname, `video_${Date.now()}.webm`);
    fs.writeFile(filePath, buffer, (err,data1) => {
      if (err) {
        console.error('Error writing video file', err);
      } else {
        socket.server.in(data.room).emit('videoFile', {video:buffer});
      }
    });
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});

