const users = [];

const addUser = ({ id, username, room }) => {
  let response = { error: null, user: null };

  try {
    if (!username || !room) {
      throw new Error("invalid username or room");
    }

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
      throw new Error("Username and room are required!");
    }

    // Check for existing user
    const existingUser = users.find((user) => {
      return user.room === room && user.username === username;
    });

    // Validate username
    if (existingUser) {
      throw new Error("Username is in use");
    }

    // Store user
    const user = { id, username, room };
    users.push(user);
    //return { user };
    response.user = user;
  } catch (error) {
    console.error(`Error adding user: ${error.message}`);
    response.error = error.message;
  }
  return response;
};
const removeUser = (id) => {
  try {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
    return users.splice(index, 1)[0];
  } catch (error) {
    console.error(`Error removing user: ${error.message}`);
    return { error: error.message };
  }
};

const getUser = (id) => {
  try {
    const user = users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error(`Error getting user: ${error.message}`);
    return { error: error.message };
  }
};

const getUsersInRoom = (room) => {
  try {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
  } catch (error) {
    console.error(`Error getting users in room: ${error.message}`);
    return { error: error.message };
  }
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
