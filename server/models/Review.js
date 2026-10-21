const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

reviewSchema.post('save', async function() {
  const ProviderProfile = mongoose.model('ProviderProfile');
  const Review = this.constructor;

  const stats = await Review.aggregate([
    { $match: { provider: this.provider, isActive: true } },
    { $group: { _id: '$provider', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);

  if (stats.length > 0) {
    await ProviderProfile.findByIdAndUpdate(this.provider, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
