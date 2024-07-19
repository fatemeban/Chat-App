// chat.js
const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sendPictureButton = document.querySelector("#send-picture");
const $pictureInput = document.querySelector("#picture-input");
const $sidebar = document.querySelector("#sidebar");
const $audioForm = document.querySelector("#audio-form");
const $audioInput = document.querySelector("#audio-input");
// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const pictureMessageTemplate = document.querySelector(
  "#picture-message-template"
).innerHTML;
const voiceMessageTemplate = document.querySelector(
  "#voice-message-template"
).innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const arrayBuffer = message.imageBuffer;
const blob = new Blob([arrayBuffer], { type: "image/jpeg" }); // Adjust the type based on the image type
const imageUrl = URL.createObjectURL(blob);

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("sendPicture", (message) => {
  console.log("Received picture message:", message);

  const html = Mustache.render(pictureMessageTemplate, {
    username: message.username,
    imageUrl: imageUrl,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("voiceMessage", (message) => {
  console.log("Received audio message:", message);
  const html = Mustache.render(voiceMessageTemplate, {
    username: message.username,
    audioUrl: audioUrl,
    createdAt: moment(message.createdAt).format("h:mm A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered!");
  });
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

//////////image upload form/////////////

function handlePictureInput(event) {
  const file = event.target.files[0];
  if (!file) {
    return error;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const base64Image = reader.result;
    socket.emit("sendImage", base64Image, (error) => {
      if (error) {
        console.error("Error sending picture:", error);
      } else {
        console.log("Image sent successfully");
      }
      $pictureInput.value = "";
    });
  };
  reader.readAsDataURL(file);
}

//////////audio upload form/////////////

$audioForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const file = $audioInput.files[0];

  if (!file) {
    return console.error("No file selected");
  }

  const reader = new FileReader();

  reader.onload = () => {
    const base64Audio = reader.result;
    socket.emit("sendAudio", base64Audio, (error) => {
      if (error) {
        console.error("Error sending audio:", error);
      } else {
        console.log("Audio sent successfully");
      }
      $audioInput.value = "";
    });
  };

  reader.readAsDataURL(file);
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
