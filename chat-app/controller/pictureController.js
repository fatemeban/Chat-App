// const { generatePictureMessage } = require("../utils/messages");
// const { getUser } = require("../utils/users");

// exports.uploadFile = (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   const user = getUser(req.body.userId);
//   if (user) {
//     req.app
//       .get("io")
//       .to(user.room)
//       .emit(
//         "pictureMessage",
//         generatePictureMessage(user.username, req.file.buffer)
//       );
//   }
//   res.status(200).send("File uploaded and broadcasted successfully");
// };

// exports.sendPicture = (io, socket, arrayBuffer) => {
//   const user = getUser(socket.id);
//   if (!user) {
//     return;
//   }

//   io.to(user.room).emit(
//     "pictureMessage",
//     generatePictureMessage(user.username, arrayBuffer)
//   );
// };

const { generatePictureMessage } = require("../src/utils/messages");
const { getUser } = require("../src/utils/users");

function handlePictureMessage(io, socket) {
  socket.on("sendPicture", (base64Image, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return callback("User not found");
    }
    io.to(user.room).emit(
      "pictureMessage",
      generatePictureMessage(user.username, base64Image)
    );
  });
}

module.exports = handlePictureMessage;
