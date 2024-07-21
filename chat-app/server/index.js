const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const socketHandler = require("./socketHandlers");
const multer = require("multer");
const routesHandler = require("./routeHandlers");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3003;
const publicDirectoryPath = path.join(__dirname, "../public");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (
      ![".jpg", ".jpeg", ".png", ".gif", ".mp3", ".ogg", ".mp4"].includes(ext)
    ) {
      return callback(new Error("Only images/audios/videos are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.use(express.static(publicDirectoryPath));

socketHandler(io);
routesHandler(app, io, upload);

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
