const { genarateMessage } = require("../utils/messages");
const { getUser } = require("../utils/users");

// const uploadFile = (req, res) => {
//   res.send("File uploaded successfully");
// };

// exports.join = (io, socket, options) => {
//   const { error, user } = addUser({ id: socket.id, ...options });

//   if (error) {
//     return error;
//   }

//   socket.join(user.room);

//   socket.emit("message", generateMessage("Admin", "Welcome!"));
//   socket.broadcast
//     .to(user.room)
//     .emit("message", generateMessage("Admin", `${user.username} has joined!`));
//   io.to(user.room).emit("roomData", {
//     room: user.room,
//     users: getUsersInRoom(user.room),
//   });
// };

// exports.sendMessage = (io, socket, message) => {
//   const user = getUser(socket.id);
//   if (!user) {
//     return "User not found";
//   }

//   io.to(user.room).emit("message", generateMessage(user.username, message));
// };

// module.exports = { uploadFile, join, sendMessage };

const Filter = require("bad-words");

function handleMessage(io, socket) {
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
}

module.exports = handleMessage;
