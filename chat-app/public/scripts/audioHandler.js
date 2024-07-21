window.initializeAudioHandlers = (socket, state) => {
  const $messages = document.querySelector("#messages");
  const voiceMessageTemplate = document.querySelector(
    "#voice-message-template"
  ).innerHTML;
  const pictureMessageTemplate = document.querySelector(
    "#picture-message-template"
  ).innerHTML;
  const $audioForm = document.querySelector("#audio-form");
  const $audioInput = document.querySelector("#audio-input");

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
    } else {
      // video
      // todo: create video component
      const html = Mustache.render(pictureMessageTemplate, {
        username: message.username,
        imageUrl: message.url,
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
};
