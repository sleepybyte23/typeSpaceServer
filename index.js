const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  pingInterval: 10000,
  pingTimeout: 5000
});
//const io = require('socket.io')(3000);
const redisAdapter = require('socket.io-redis');
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const {
  addUser,
  getUser,
  deleteUser,
  getUsers,
  addRoom,
  roomExist,
  deleteRoom,
} = require("./users");

//io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

app.use(cors());

io.on("connection", (socket) => {
  var logoffTimer;

  socket.on("login", ({ name, roomId, modCode }, callback) => {
    console.log("login", name, roomId);

    const { rm, err } = addRoom(roomId, modCode);
    if (err) return callback(err);

    const { user, error } = addUser(socket.id, name, roomId);
    if (error) return callback(error);

    socket.join(user.room);
    socket
      .in(roomId)
      .emit("notification", {
        title: "Someone's here",
        description: `${user.name} just entered the room`,
      });
    io.in(roomId).emit("users", getUsers(roomId));
    timerr(roomId);
    callback();
  });

  socket.on("goto", ({ name, room, modCode }, callback) => {
    console.log("login", name, room, modCode);

    const { isModz, err } = roomExist(room, modCode);
    if (err) return callback(err);
    
        const { user, error } = addUser(socket.id, name, room);
        if (error) return callback(error);
        socket.join(user.room);
        //io.in(user.room).emit('message', { user: user.name, text: "tatttti" });
        socket
          .in(room)
          .emit("notification", {
            title: "Someone's here",
            description: `${user.name} just entered the room`,
          });
        io.in(room).emit("users", getUsers(room));
        //io.to(socket.id).emit('message', { user: user.name, text: "tatttti" });
        timerr(user.room);
        console.log("rmmmm", isModz);
        callback(isModz);    
  });

  function timerr(roomId) {
    clearTimeout(logoffTimer); 
    let xx = roomId
    logoffTimer = setTimeout(function(){
      console.log('tooo', xx);
      io.in(xx).emit("message", { user: "GOD", text: "logout" });
      
      deleteRoom(xx);
      console.log(getUsers(xx));
  }, 5000);
  }

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    console.log(user);
    io.in(user.room).emit("message", { user: user.name, text: message });
    timerr(user.room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = deleteUser(socket.id);

    if (user) {
      io.in(user.room).emit("notification", {
        title: "Someone just left",
        description: `${user.name} just left the room`,
      });
      io.in(user.room).emit("users", getUsers(user.room));
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
