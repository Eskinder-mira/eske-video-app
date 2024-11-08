// // server.js
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static('public')); // Serve static files from 'public' folder

// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('offer', (offer) => {
//         socket.broadcast.emit('offer', offer);
//     });

//     socket.on('answer', (answer) => {
//         socket.broadcast.emit('answer', answer);
//     });

//     socket.on('ice-candidate', (candidate) => {
//         socket.broadcast.emit('ice-candidate', candidate);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });










// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
