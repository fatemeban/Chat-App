window.initializePictureHandlers = (socket) => {
  const $messages = document.querySelector("#messages");
  const $pictureInput = document.querySelector("#picture-input");

  // $audioForm.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   const file = $audioInput.files[0];
  //   if (!file) {
  //     return console.error("No file selected");
  //   }

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const base64Image = reader.result;
  //     socket.emit("sendImage", base64Image, (error) => {
  //       if (error) {
  //         console.error("Error sending picture:", error);
  //       }
  //       $pictureInput.value = "";
  //     });
  //   };
  //   reader.readAsDataURL(file);
  // });
};
