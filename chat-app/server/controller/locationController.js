const { generateLocationMessage } = require("../utils/messages");
const { getUser } = require("../utils/users");

function handleLocationMessage(io, socket) {
  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }

    if (
      typeof coords !== "object" ||
      coords === null ||
      typeof coords.latitude !== "number" ||
      typeof coords.longitude !== "number"
    ) {
      return callback("Invalid coordinates");
    }

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });
}

module.exports = handleLocationMessage;
