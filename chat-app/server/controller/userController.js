const { addUser, removeUser, getUsersInRoom } = require("../utils/users");
const { generateMessage } = require("../utils/messages");

function handleUser(io, socket) {
  socket.on("join", (options, callback) => {
    try {
      const { error, user } = addUser({ id: socket.id, ...options });
      if (error) {
        console.log($`error`);
      }
      if (!user) {
        return callback({ error: "User not found" });
      }

      socket.join(user.room);

      socket.emit("message", generateMessage("Admin", "Welcome!"));
      socket.emit("sessionId", socket.id);

      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          generateMessage("Admin", `${user.username} has joined!`)
        );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    } catch (error) {
      console.error("Error handling join event:", error);
      return callback("An unexpected error occurred. Please try again.");
    }
  });

  socket.on("disconnect", () => {
    try {
      const user = removeUser(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          generateMessage("Admin", `${user.username} has left`)
        );
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    } catch (error) {
      console.error("Error handling disconnect event:", error);
    }
  });
}

module.exports = handleUser;
