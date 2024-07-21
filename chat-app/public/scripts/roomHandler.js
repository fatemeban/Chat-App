const $sidebar = document.querySelector("#sidebar");

window.initializeRoomHandlers = (socket) => {
  socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, { room, users });
    document.querySelector("#sidebar").innerHTML = html;
  });
};
