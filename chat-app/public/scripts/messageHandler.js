window.initializeMessageHandlers = (socket) => {
  const $messages = document.querySelector("#messages");
  const messageTemplate = document.querySelector("#message-template").innerHTML;

  socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm A"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
  });

  document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const $messageFormButton = e.target.querySelector("button");
    const $messageFormInput = e.target.querySelector("input");

    $messageFormButton.setAttribute("disabled", "disabled");
    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();
      if (error) {
        console.log(error);
      }
      console.log("Message delivered!");
    });
  });
};
