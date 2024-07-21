const { getUser } = require("../utils/users");
const { body, matchedData, validationResult } = require("express-validator");
const { generateFileMessage } = require("..//utils/messages");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

function handleFile(express, socket, multer) {
  express.post(
    "/file-upload",
    multer.array("files", 5),
    body("session_id").notEmpty(),
    body("type").notEmpty().isIn(["audio", "video", "image"]),
    (req, res) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.json({
          status: "ERROR",
          type: "VALIDATION_ERROR",
          error: result,
        });

        return;
      }

      const body = matchedData(req);
      const user = getUser(body.session_id);
      if (!user) {
        res.json({
          status: "ERROR",
          type: "INVALID_SESSION_ID",
        });

        return;
      }

      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const fileName = `${uuidv4()}${ext}`;
        const filePath = path.join(__dirname, "../../public/uploads", fileName);
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err) {
            console.error("could not write file to fs", err);

            return;
          }

          socket
            .to(user.room)
            .emit(
              "fileMessage",
              generateFileMessage(
                body.type,
                user.username,
                `${config.api.uploadsBaseUrl}/${fileName}`
              )
            );
        });
      }

      res.json({
        status: "SUCCESS",
      });
    }
  );
}

module.exports = handleFile;
