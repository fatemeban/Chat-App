window.initializeLocationHandlers = (socket) => {
  const $sendLocationButton = document.querySelector("#send-location");
  const $messages = document.querySelector("#messages");
  const locationMessageTemplate = document.querySelector(
    "#location-message-template"
  ).innerHTML;

  socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
      username: message.username,
      url: message.url,
      createdAt: moment(message.createdAt).format("h:mm A"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
  });

  $sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }
    $sendLocationButton.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        () => {
          $sendLocationButton.removeAttribute("disabled");
          console.log("Location shared!");
        }
      );
    });
  });
};
