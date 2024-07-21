const handleFile = require("./controller/fileController");

function routesHandler(express, socket, multer) {
  handleFile(express, socket, multer);
}

module.exports = routesHandler;
