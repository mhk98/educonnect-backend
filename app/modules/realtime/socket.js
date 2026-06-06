const jwt = require("jsonwebtoken");

let io = null;
const userSocketMap = new Map(); // userId → Set of socketIds

const initSocket = (server) => {
  const { Server } = require("socket.io");

  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:3000"];

  io = new Server(server, {
    cors: { origin: ALLOWED_ORIGINS, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const user = jwt.verify(token, process.env.TOKEN_SECRET);
      socket.userId = user.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket;
    if (!userSocketMap.has(userId)) userSocketMap.set(userId, new Set());
    userSocketMap.get(userId).add(socket.id);

    socket.on("chat:conversation:join", ({ conversationId }) => {
      if (conversationId) socket.join(`conv:${conversationId}`);
    });

    socket.on("disconnect", () => {
      const ids = userSocketMap.get(userId);
      if (ids) {
        ids.delete(socket.id);
        if (ids.size === 0) userSocketMap.delete(userId);
      }
    });
  });

  return io;
};

const emitToUser = (userId, event, payload) => {
  if (!io) return;
  if (userId === "__broadcast__") {
    io.emit(event, payload);
    return;
  }
  const ids = userSocketMap.get(String(userId));
  if (!ids) return;
  for (const socketId of ids) {
    io.to(socketId).emit(event, payload);
  }
};

module.exports = { initSocket, emitToUser };
