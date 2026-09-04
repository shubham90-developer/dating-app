import { Server } from "socket.io";
import jwt from "jsonwebtoken";
let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        /* same array as app.ts cors() */
      ],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const decoded = jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET!,
      ) as any;
      if (decoded.role !== "admin" || decoded.status !== "active")
        throw new Error();
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => socket.join("admin"));
  return io;
};
export const getIO = () => io;
