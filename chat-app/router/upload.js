const express = require("express");
const multer = require("multer");
const { getUser } = require("../src/utils/users");
const {
  generateaudioMessage,
  generatePictureMessage,
} = require("../src/utils/messages");

const router = new express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/////    Route for uploading picture    //////
router.post("/picture", upload.single("picture"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file upload");
  }
  const user = getUser(req.body.user.userId);
  if (user) {
    req.io
      .to(user.room)
      .emit(
        "pictureMessage",
        generatePictureMessage(req.file.buffer, user.username)
      );
  }
  res.status(200).send("Picture file uploaded and broadcasted successfully");
});

/////    Route for uploading audio    //////
router.post("/audio", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file upload");
  }

  const user = getUser(req.body.userId);
  if (user) {
    req.io
      .to(user.room)
      .emit(
        "audioMessage",
        generateaudioMessage(req.file.buffer, user.username)
      );
  }
  res.status(200).send("Audio file uploaded and broadcasted successfully");
});

module.exports = router;
