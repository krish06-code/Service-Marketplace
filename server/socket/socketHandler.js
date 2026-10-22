const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const { corsOptions } = require('../config/cors');

let io;

const initSocket = (httpServer) => {
  io = socketIo(httpServer, {
    cors: corsOptions
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || 
                    (socket.handshake.headers.cookie && socket.handshake.headers.cookie.split('token=')[1]?.split(';')[0]);
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user._id}`);
    
    // Join personal room for notifications
    socket.join(`user:${socket.user._id}`);

    socket.on('join_conversation', async (data) => {
      try {
        const conversationId = typeof data === 'object' && data !== null ? data.conversationId : data;
        if (!conversationId) return;
        const conversation = await Conversation.findById(conversationId);
        if (conversation && conversation.participants.some(p => p.toString() === socket.user._id.toString())) {
          socket.join(`conversation:${conversationId}`);
        }
      } catch (error) {
        console.error('Error joining conversation:', error);
      }
    });

    socket.on('send_message', async (data) => {
      try {
        const conversationId = data?.conversationId;
        const content = data?.content;
        if (!conversationId || !content) return;
        const message = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          content
        });

        const conversation = await Conversation.findByIdAndUpdate(
          conversationId,
          { 
            lastMessage: content,
            lastMessageAt: new Date()
          },
          { new: true }
        );

        io.to(`conversation:${conversationId}`).emit('new_message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('typing', (data) => {
      const conversationId = typeof data === 'object' && data !== null ? data.conversationId : data;
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit('user_typing', {
          userId: socket.user._id,
          conversationId
        });
      }
    });

    socket.on('mark_read', async (data) => {
      try {
        const conversationId = typeof data === 'object' && data !== null ? data.conversationId : data;
        if (!conversationId) return;
        await Message.updateMany(
          { conversation: conversationId, sender: { $ne: socket.user._id }, isRead: false },
          { isRead: true }
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user._id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
