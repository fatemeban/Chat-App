const socket = io();
const state = {
  sessionId: undefined,
};

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("sessionId", (message) => {
  state.sessionId = message;
});

initializeMessageHandlers(socket, state);
initializeLocationHandlers(socket, state);
initializePictureHandlers(socket, state);
initializeAudioHandlers(socket, state);
