const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  scheduledDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  customerNotes: { type: String },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
  cancellationReason: { type: String },
  completedAt: { type: Date }
}, { timestamps: true });

bookingSchema.index({ provider: 1, scheduledDate: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
