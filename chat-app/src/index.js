const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  genarateMessage,
  genarateLocationMessage,
  generatePictureMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3003;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", genarateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        genarateMessage("Admin", `${user.username} has joined!`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.to(user.room).emit("message", genarateMessage(user.username, message));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }
    io.to(user.room).emit(
      "locationMessage",
      genarateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("sendPicture", (base64Image, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }
    io.to(user.room).emit(
      "pictureMessage",
      generatePictureMessage(user.username, base64Image)
    );
    callback();
  });

  socket.on("sendVoiceMessage", (audioBlob, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }

    io.to(user.room).emit(
      "voiceMessage",
      generateVoiceMessage(user.username, audioBlob)
    );
    callback();
  });

  function generateVoiceMessage(username, audioBlob) {
    return {
      username,
      audioBlob,
      createdAt: new Date().getTime(),
    };
  }

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        genarateMessage("Admin", `${user.username} has left`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
