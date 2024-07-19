// import moment from "moment";
// import Mustache from "mustache";
// import { autoscroll } from "../utils/utils";

const eventHandlers = (socket, elements) => {
  const {
    $messageForm,
    $sendLocationButton,
    $pictureInput,
    $audioForm,
    $audioInput,
  } = elements;

  // Handle message form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const $messageFormButton = $messageForm.querySelector("button");
    const $messageFormInput = $messageForm.querySelector("input");

    $messageFormButton.setAttribute("disabled", "disabled");
    const message = $messageFormInput.value;

    socket.emit("sendMessage", message, (error) => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();

      if (error) {
        console.log(error);
      } else {
        console.log("Message delivered!");
      }
    });
  };

  const handleSendLocation = () => {
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
  };

  //////////image upload form/////////////

  const handlePictureInput = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return console.error("No file selected");
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
  };

  //////////audio upload form/////////////

  const handleAudioFormSubmit = (e) => {
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
  };

  // Attach event listeners
  $messageForm.addEventListener("submit", handleFormSubmit);
  $sendLocationButton.addEventListener("click", handleSendLocation);
  $pictureInput.addEventListener("change", handlePictureInput);
  $audioForm.addEventListener("submit", handleAudioFormSubmit);

  return {
    handleFormSubmit,
    handleSendLocation,
    handlePictureInput,
    handleAudioFormSubmit,
  };
};

export default eventHandlers;
