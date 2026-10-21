const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { getIO } = require('../socket/socketHandler');
const { sendSuccess, sendError } = require('../utils/response');

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar')
      .populate('booking', 'status')
      .sort({ lastMessageAt: -1 });
    return sendSuccess(res, 200, 'Conversations fetched', { conversations });
  } catch (error) {
    next(error);
  }
};

const getOrCreateConversation = async (req, res, next) => {
  try {
    const { otherUserId, bookingId } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, otherUserId] }
    }).populate('participants', 'name avatar');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, otherUserId],
        booking: bookingId
      });
      conversation = await conversation.populate('participants', 'name avatar');
    }

    return sendSuccess(res, 200, 'Conversation fetched', { conversation });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, participants: req.user._id });
    if (!conversation) return sendError(res, 404, 'Conversation not found');

    const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });
    return sendSuccess(res, 200, 'Messages fetched', { messages });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const conversation = await Conversation.findOne({ _id: req.params.id, participants: req.user._id });
    if (!conversation) return sendError(res, 404, 'Conversation not found');

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content
    });

    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    try {
      getIO().to(`conversation:${conversation._id}`).emit('new_message', message);
    } catch(err) {
      console.log('Socket not ready');
    }

    return sendSuccess(res, 201, 'Message sent', { message });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true }
    );
    return sendSuccess(res, 200, 'Messages marked as read');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markAsRead
};
