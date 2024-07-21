const { addUser, removeUser, getUsersInRoom } = require("../utils/users");
const { genarateMessage } = require("../utils/messages");

function handleUser(io, socket) {
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", genarateMessage("Admin", "Welcome!"));
    socket.emit("sessionId", socket.id);
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
  });

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
}

module.exports = handleUser;
