const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ProviderProfile = require('../models/ProviderProfile');
const { createNotification } = require('../utils/notifications');
const { sendSuccess, sendError } = require('../utils/response');

// Recalculate provider rating after any change
const recalcProviderRating = async (providerId) => {
  const mongoose = require('mongoose');
  const stats = await Review.aggregate([
    { $match: { provider: new mongoose.Types.ObjectId(String(providerId)), isActive: true } },
    { $group: { _id: '$provider', averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);
  const avg = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
  const total = stats.length > 0 ? stats[0].totalReviews : 0;
  await ProviderProfile.findByIdAndUpdate(providerId, { averageRating: avg, totalReviews: total });
};

const createReview = async (req, res, next) => {
  try {
    // Accept both {booking, provider} and {bookingId} for compatibility
    const bookingId = req.body.booking || req.body.bookingId;
    const { rating, comment } = req.body;

    if (!bookingId) return sendError(res, 400, 'booking is required');

    const booking = await Booking.findOne({ _id: bookingId, customer: req.user._id, status: 'completed' });
    if (!booking) return sendError(res, 404, 'Eligible completed booking not found');

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) return sendError(res, 400, 'You have already reviewed this booking');

    const review = await Review.create({
      customer: req.user._id,
      provider: booking.provider,
      booking: bookingId,
      rating,
      comment
    });

    // Update provider averageRating
    try { await recalcProviderRating(booking.provider); } catch (e) { /* non-fatal */ }

    const provider = await ProviderProfile.findById(booking.provider);
    if (provider) {
      await createNotification(
        provider.user, 'review', 'New Review',
        `You received a ${rating}-star review`,
        { providerId: provider._id }
      );
    }

    return sendSuccess(res, 201, 'Review created', { review });
  } catch (error) {
    next(error);
  }
};

const getProviderReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { provider: req.params.providerId, isActive: true };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('customer', 'name avatar')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Reviews fetched', { reviews, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// Reviews I (customer) wrote
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ customer: req.user._id })
      .populate({ path: 'provider', populate: { path: 'user', select: 'name avatar' } })
      .populate({ path: 'booking', populate: { path: 'service', select: 'title' } })
      .sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'My reviews', { reviews });
  } catch (error) {
    next(error);
  }
};

// Reviews received by the logged-in provider
const getMyProviderReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const profile = await ProviderProfile.findOne({ user: req.user._id });
    if (!profile) return sendError(res, 404, 'Provider profile not found');

    const filter = { provider: profile._id, isActive: true };
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('customer', 'name avatar')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Provider reviews', { reviews, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

const adminDeleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!review) return sendError(res, 404, 'Review not found');
    try { await recalcProviderRating(review.provider); } catch (e) { /* non-fatal */ }
    return sendSuccess(res, 200, 'Review deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProviderReviews,
  getMyReviews,
  getMyProviderReviews,
  adminDeleteReview
};
