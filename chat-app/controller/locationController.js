const { generateLocationMessage } = require("../src/utils/messages");
const { getUser } = require("../src/utils/users");

// exports.generateLocation = (io, socket, coords, callback) => {
//   const user = getUser(socket.id);
//   if (!user) {
//     return callback("user not found");
//   }
//   io.to(user.room).emit(
//     "locationMessage",
//     generateLocationMessage(
//       user.username,
//       `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
//     )
//   );
//   callback();
// };

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
