const { generateMessage } = require("../utils/messages");
const { getUser } = require("../utils/users");

const Filter = require("bad-words");

function handleMessage(io, socket) {
  socket.on("sendMessage", (message, callback) => {
    try {
      if (typeof message !== "string" || message.trim() === "") {
        return callback("Invalid message");
      }
      const user = getUser(socket.id);
      if (!user) {
        return callback("User not found");
      }

      const filter = new Filter();
      if (filter.isProfane(message)) {
        return callback("Profanity is not allowed!");
      }

      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback();
    } catch (error) {
      console.log("Error handeling send message ", error);
      callback("An error occurred while sending the message");
    }
  });
}

module.exports = handleMessage;
