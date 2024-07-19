const genarateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};
const generateLocationMessage = (username, url) => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};

const generatePictureMessage = (username, buffer) => {// Debugging statement
  return {
    username,
    buffer: buffer.toString("base64"),
    createdAt: new Date().getTime(),
  };
};

const generateVoiceMessage = (username, buffer) => {
  return {
    username,
    buffer: buffer.toString("base64"),
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  genarateMessage,
  generateLocationMessage,
  generatePictureMessage,
  generateVoiceMessage,
  generateVoiceMessage,
};
