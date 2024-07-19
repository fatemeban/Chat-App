// chat.js

import socketManager from "../public/js/chat";
import eventHandlers from "..src/handlers/eventHandlers";
import { autoscroll } from "../src/utils/utils";

document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    $messageForm: document.querySelector("#message-form"),
    $sendLocationButton: document.querySelector("#send-location"),
    $messages: document.querySelector("#messages"),
    $pictureInput: document.querySelector("#picture-input"),
    $audioForm: document.querySelector("#audio-form"),
    $audioInput: document.querySelector("#audio-input"),
  };

  const templates = {
    messageTemplate: document.querySelector("#message-template").innerHTML,
    locationMessageTemplate: document.querySelector(
      "#location-message-template"
    ).innerHTML,
    pictureMessageTemplate: document.querySelector("#picture-message-template")
      .innerHTML,
    voiceMessageTemplate: document.querySelector("#voice-message-template")
      .innerHTML,
    sidebarTemplate: document.querySelector("#sidebar-template").innerHTML,
  };

  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const { socket, initializeListeners, joinRoom } = socketManager();
  initializeListeners({
    handleMessage,
    handleLocationMessage,
    handlePictureMessage,
    handleAudioMessage,
    handleRoomData,
  });

  const {
    handleFormSubmit,
    handleSendLocation,
    handlePictureInput,
    handleAudioFormSubmit,
  } = eventHandlers(socket, elements, templates);

  // Event listeners
  elements.$messageForm.addEventListener("submit", handleFormSubmit);
  elements.$sendLocationButton.addEventListener("click", handleSendLocation);
  elements.$pictureInput.addEventListener("change", handlePictureInput);
  elements.$audioForm.addEventListener("submit", handleAudioFormSubmit);

  // Autoscroll
  socket.on("message", () => autoscroll(elements.$messages));
  socket.on("locationMessage", () => autoscroll(elements.$messages));
  socket.on("sendPicture", () => autoscroll(elements.$messages));
  socket.on("audioStream", () => autoscroll(elements.$messages));

  // Join room
  joinRoom(username, room, (error) => {
    if (error) {
      alert(error);
      location.href = "/";
    }
  });
});
