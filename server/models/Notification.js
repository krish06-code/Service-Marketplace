const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['booking', 'message', 'payment', 'review', 'system'] },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  metadata: {
    bookingId: { type: mongoose.Schema.Types.ObjectId },
    providerId: { type: mongoose.Schema.Types.ObjectId },
    conversationId: { type: mongoose.Schema.Types.ObjectId }
  }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
