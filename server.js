// Import dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();
const server = http.createServer(app);

// Create Socket.io instance attached to the server
const io = socketIo(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', socket => {
    console.log('New client connected');

    // Listen for the 'offer' event
    socket.on('offer', (offer) => {
        console.log("Sending offer to other clients...");
        socket.broadcast.emit('offer', offer); // Broadcast the offer to other clients
    });

    // Listen for the 'answer' event
    socket.on('answer', (answer) => {
        console.log("Sending answer to other clients...");
        socket.broadcast.emit('answer', answer); // Broadcast the answer to other clients
    });

    // Listen for ICE candidates
    socket.on('ice-candidate', (candidate) => {
        console.log("Sending ICE candidate to other clients...");
        socket.broadcast.emit('ice-candidate', candidate); // Broadcast ICE candidate to other clients
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
