const { generateVoiceMessage } = require("../src/utils/messages");
const { getUser } = require("../src/utils/users");

function handleVoiceMessage(io, socket) {
  socket.on("sendVoiceMessage", (base64Audio, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }

    io.to(user.room).emit(
      "voiceMessage",
      generateVoiceMessage(user.username, base64Audio)
    );
  });
}

module.exports = handleVoiceMessage;
