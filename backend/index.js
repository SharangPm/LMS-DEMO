require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const router = require('./Route/route');
const path = require('path');
require('./DB/connections');

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (update this in production)
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

// When a client sends a message
socket.on("send_message", (data) => {
  // Broadcast to all other clients except the sender
  socket.broadcast.emit("receive_message", data);
});

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

// Serve static files (images, videos) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes for handling requests (including courses and other APIs)
app.use(router);

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});