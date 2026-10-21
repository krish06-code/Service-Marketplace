const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  lastMessage: { type: String },
  lastMessageAt: { type: Date },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
