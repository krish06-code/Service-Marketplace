const mongoose = require('mongoose');

const providerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String },
  experience: { type: Number },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  skills: [{ type: String }],
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  serviceRadius: { type: Number, default: 10 },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  startingPrice: { type: Number, default: 299 },
  availability: {
    monday: { isAvailable: { type: Boolean, default: true }, startTime: { type: String, default: '09:00' }, endTime: { type: String, default: '18:00' } },
    tuesday: { isAvailable: { type: Boolean, default: true }, startTime: { type: String, default: '09:00' }, endTime: { type: String, default: '18:00' } },
    wednesday: { isAvailable: { type: Boolean, default: true }, startTime: { type: String, default: '09:00' }, endTime: { type: String, default: '18:00' } },
    thursday: { isAvailable: { type: Boolean, default: true }, startTime: { type: String, default: '09:00' }, endTime: { type: String, default: '18:00' } },
    friday: { isAvailable: { type: Boolean, default: true }, startTime: { type: String, default: '09:00' }, endTime: { type: String, default: '18:00' } },
    saturday: { isAvailable: { type: Boolean, default: true }, startTime: { type: String, default: '09:00' }, endTime: { type: String, default: '18:00' } },
    sunday: { isAvailable: { type: Boolean, default: false }, startTime: { type: String, default: '09:00' }, endTime: { type: String, default: '18:00' } }
  },
  unavailableDates: [{ type: Date }],
  slotDuration: { type: Number, default: 60 },
  totalEarnings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
