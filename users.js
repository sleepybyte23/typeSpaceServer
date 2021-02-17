const users = [];
const roomIds = {};

const addUser = (id, name, room) => {
  const existingUser = users.find(
    (user) => user.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (existingUser) return { error: "Username has already been taken" };
  if (!name && !room) return { error: "Username and room are required" };
  if (!name) return { error: "Username is required" };
  if (!room) return { error: "Room is required" };

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const getUser = (id) => {
  let user = users.find((user) => user.id == id);
  return user;
};

const addRoom = (roomId, modCode) => {
  //console.log(roomIds, roomId, modCode, roomIds.indexOf(roomId));

  if (roomId in roomIds) {
    return { err: "Room already exist, on create" };
  } else {
    roomIds[roomId] = modCode;
    console.log("roomIds on Create", roomIds);
    return roomId;
  }

//   if (roomIds.indexOf(roomId) > -1) {
//     return { err: "Room already exist, on create" };
//   } else {
//     const room = { roomId, modCode };
//     roomIds.push(room);
//     console.log(roomIds);    
//     return room;
//   }
  //
};

const roomExist = (roomId, modCode) => {
    console.log("ROOMIDS on join", roomIds, roomId, modCode);
    if (roomId in roomIds) {
        if(roomIds[roomId] === modCode) {
            console.log("MOD__TRU");
            return {isModz : true};
        } else {
            console.log("MOD__FALSE");
            return {isModz : false};
        }
      } else {
        return { err: "Room dont exist, on join" };
      }  
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const deleteRoom = (roomId) => {
  //users = users.filter((user) => user.room !== roomId);
  return users;
}
const getUsers = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, getUser, deleteUser, getUsers, addRoom, roomExist, deleteRoom };
