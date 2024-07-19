const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controller/MessageController");

const messageRouters = express.Router();
const upload = multer({ dest: "uploads/files" });

messageRouters.post("/upload-file", upload.single("file"), uploadFile);

module.exports = messageRouters;
