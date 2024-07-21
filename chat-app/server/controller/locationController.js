const { generateLocationMessage } = require("../utils/messages");
const { getUser } = require("../utils/users");

function handleLocationMessage(io, socket) {
  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
  });
}

module.exports = handleLocationMessage;
