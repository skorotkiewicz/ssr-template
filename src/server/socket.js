import { Server as SocketServer } from "socket.io";

let io;

export function initializeSocket(httpServer) {
  io = new SocketServer(httpServer);

  io.on("connection", (socket) => {
    // console.log("Client connected");
    // socket.on("disconnect", () => console.log("Client disconnected"));
  });

  return io;
}

export { io };
