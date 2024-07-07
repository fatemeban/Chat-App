//const moment = require("moment");

//const Mustache = require("mustache");
const socket = io();
//Element
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("Button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#message");

//templates

const messageTemplates = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplates, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");
  //disable
  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    //enable
    if (error) {
      return console.log(error);
    }
    console.log("Message deleverd");
  });
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not suported by your browser");
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
        console.log("Location shared");
      }
    );
  });
});
