require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http'); // 👈
const { Server } = require('socket.io'); // 👈
const Message = require('./models/Message'); // 👈 create this model

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app); // 👈 needed for socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// REST APIs
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// MongoDB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));

// 👇 SOCKET.IO Logic
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('joinRoom', async ({ roomId }) => {
    socket.join(roomId);
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    socket.emit('previousMessages', messages);
  });

  socket.on('sendMessage', async ({ roomId, message }) => {
    const newMsg = new Message({
      roomId,
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp || Date.now()
    });
    await newMsg.save();
    io.to(roomId).emit('receiveMessage', newMsg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});
