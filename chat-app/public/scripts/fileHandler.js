window.initializeFileHandlers = (socket, state) => {
  const $messages = document.querySelector("#messages");
  const voiceMessageTemplate = document.querySelector(
    "#voice-message-template"
  ).innerHTML;
  const pictureMessageTemplate = document.querySelector(
    "#picture-message-template"
  ).innerHTML;
  const videoMessageTemplate = document.querySelector(
    "#video-message-template"
  ).innerHTML;
  const $videoForm = document.querySelector("#video-form");
  const $videoInput = document.querySelector("#video-input");

  socket.on("fileMessage", (message) => {
    if (message.type === "audio") {
      console.log(message);
      const html = Mustache.render(voiceMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm A"),
      });
      $messages.insertAdjacentHTML("beforeend", html);
      autoscroll();
    } else if (message.type === "image") {
      const html = Mustache.render(pictureMessageTemplate, {
        username: message.username,
        imageUrl: message.url,
        createdAt: moment(message.createdAt).format("h:mm A"),
      });
      $messages.insertAdjacentHTML("beforeend", html);
      autoscroll();
    } else if (message.type === "video") {
      // video
      // todo: create video component
      const html = Mustache.render(videoMessageTemplate, {
        username: message.username,
        videoUrl: message.url,
        createdAt: moment(message.createdAt).format("h:mm A"),
      });
      $messages.insertAdjacentHTML("beforeend", html);
      autoscroll();
    }
  });
  $audioForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = $audioInput.files[0];
    if (!file) {
      return console.error("No file selected");
    }

    var data = new FormData();
    data.append("files", file);
    data.append("type", "audio");
    data.append("session_id", state.sessionId);

    fetch("/file-upload", {
      method: "POST",
      body: data,
    })
      .then(() => {
        console.log("Audio sent successfully");
        $audioInput.value = "";
      })
      .catch((err) => {
        console.error("Error sending audio:", err);
      });
  });
  $videoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = $videoInput.files[0];
    if (!file) {
      return console.error("No video file selected");
    }

    const data = new FormData();
    data.append("files", file);
    data.append("type", "video");
    data.append("session_id", state.sessionId);

    fetch("/file-upload", {
      method: "POST",
      body: data,
    })
      .then(() => {
        console.log("Video sent successfully");
        $videoInput.value = "";
      })
      .catch((err) => {
        console.error("Error sending video:", err);
      });
  });
};
