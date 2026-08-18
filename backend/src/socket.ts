import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket.IO client connected: ${socket.id}`);

    // Join a room for a specific restaurant/userId if needed
    socket.on('joinRestaurant', (restaurantId: string) => {
      socket.join(restaurantId);
      console.log(`Client ${socket.id} joined restaurant ${restaurantId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
