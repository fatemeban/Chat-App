const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  genarateMessage,
  genarateLocationMessage,
} = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3003;
const publicePath = path.join(__dirname, "../public");

app.use(express.static(publicePath));

//send message to the client
io.on("connection", (socket) => {
  console.log("New webSocket connection");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", genarateMessage("welcome"));
    socket.broadcast
      .to(room)
      .emit("message", genarateMessage(`${username} has joined!`));
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Porfnaty is not allowed");
    }
    io.emit("message", genarateMessage(message));
    callback();
  });
  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      genarateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("message", genarateMessage("A user has left"));
  });
});

server.listen(port, () => {
  console.log(`server is up  on ${port}`);
});
