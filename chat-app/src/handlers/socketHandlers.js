const locationController = require("../../controller/locationController");
const userController = require("../../controller/userController");
const audioController = require("../../controller/audioController");
const messageController = require("../../controller/messageController"); // Add this line
const pictureController = require("../../controller/pictureController");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`New WebSocket connection with ${socket.id} id`);

    userController(io, socket);
    messageController(io, socket);
    audioController(io, socket);
    locationController(io, socket);
    pictureController(io, socket);
  });
}
module.exports = socketHandler;
