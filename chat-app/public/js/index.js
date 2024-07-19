// const path = require("path");
// const http = require("http");
// const express = require("express");
// const socketio = require("socket.io");

// const { Server } = require("socket.io");
// const locationController = require("../../controller/locationController");
// const userController = require("../../controller/usercontroller");
// const audioController = require("../../controller/audioController");
// const messageController = require("../../controller/MessageController");

// // const socketHandler = require("../../src/handlers/socketHandlers");
// const uploadRouter = require("../../router/MessagesRouter");

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// const port = process.env.PORT || 3003;
// const publicDirectoryPath = path.join(__dirname, "../public");

// ////middlewere////
// app.use(express.static(publicDirectoryPath));
// app.use(express.json());
// app.set("io", io);

// // Multer setup for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // const socketHandler = (server) => {
// //   //const io = require("socket.io")(server);
// //   const io = new Server(server);

// io.on("connection", (socket) => {
//   console.log("New WebSocket connection");

//   userController(io, socket);
//   messageController(io, socket);
//   audioController(io, socket);
//   locationController(io, socket);
//   fileController(io, socket);
// });

// // module.exports = socketHandler;

// //socketHandler(server);

// ////Routes
// app.use("/upload", uploadRouter);

// server.listen(port, () => {
//   console.log(`Server is up on port ${port}!`);
// });
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const socketHandler = require("../../src/handlers/socketHandlers");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3003;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

socketHandler(io);

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
