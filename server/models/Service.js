const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  pricingType: { type: String, enum: ['fixed', 'hourly', 'starting_from'], default: 'starting_from' },
  duration: { type: Number, default: 60 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
