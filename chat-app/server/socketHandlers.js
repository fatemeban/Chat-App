const locationController = require("./controller/locationController");
const userController = require("./controller/userController");
const messageController = require("./controller/messageController"); // Add this line

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`New WebSocket connection with ${socket.id} id`);

    userController(io, socket);
    messageController(io, socket);
    locationController(io, socket);
  });
}
module.exports = socketHandler;
