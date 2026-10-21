const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const Booking = require('../models/Booking');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const { sendSuccess, sendError } = require('../utils/response');
const { createNotification } = require('../utils/notifications');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await ProviderProfile.countDocuments();
    const pendingApprovals = await ProviderProfile.countDocuments({ verificationStatus: 'pending' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalReviews = await Review.countDocuments();
    const totalCategories = await Category.countDocuments({ active: true });

    const payments = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = payments.length > 0 ? payments[0].total : 0;

    return sendSuccess(res, 200, 'Dashboard stats', {
      totalUsers,
      totalProviders,
      pendingApprovals,
      totalBookings,
      completedBookings,
      totalReviews,
      totalCategories,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'All users', { users, total, page: parseInt(page) });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');
    if (user.role === 'admin') return sendError(res, 403, 'Cannot deactivate admin');

    user.isActive = !user.isActive;
    await user.save();
    return sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, { user });
  } catch (error) {
    next(error);
  }
};

const getAllProviders = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, search, verificationStatus } = req.query;
    const filter = {};
    if (verificationStatus) filter.verificationStatus = verificationStatus;

    let providers = await ProviderProfile.find(filter)
      .populate('user', 'name email phone avatar')
      .populate('categories', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    if (search) {
      providers = providers.filter(p =>
        p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await ProviderProfile.countDocuments(filter);
    return sendSuccess(res, 200, 'All providers', { providers, total, page: parseInt(page) });
  } catch (error) {
    next(error);
  }
};

const getPendingProviders = async (req, res, next) => {
  try {
    const providers = await ProviderProfile.find({ verificationStatus: 'pending' })
      .populate('user', 'name email phone avatar')
      .populate('categories', 'name')
      .sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Pending providers', { providers });
  } catch (error) {
    next(error);
  }
};

const approveProvider = async (req, res, next) => {
  try {
    const { status = 'approved', adminNotes } = req.body;
    if (!['approved', 'rejected'].includes(status)) return sendError(res, 400, 'Invalid status');

    const provider = await ProviderProfile.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status, ...(adminNotes && { adminNotes }) },
      { new: true }
    );
    if (!provider) return sendError(res, 404, 'Provider not found');

    const message = status === 'approved'
      ? 'Your provider profile has been approved! You can now receive bookings.'
      : `Your provider application was rejected. ${adminNotes || ''}`;

    await createNotification(provider.user, 'system', `Profile ${status}`, message);

    return sendSuccess(res, 200, `Provider ${status}`, { provider });
  } catch (error) {
    next(error);
  }
};

const rejectProvider = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'rejected' },
      { new: true }
    );
    if (!provider) return sendError(res, 404, 'Provider not found');
    await createNotification(provider.user, 'system', 'Profile Rejected', 'Your provider profile request was rejected.');
    return sendSuccess(res, 200, 'Provider rejected', { provider });
  } catch (error) {
    next(error);
  }
};

const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let bookings = await Booking.find(filter)
      .populate('customer', 'name email')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name' } })
      .populate('service', 'title')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    if (search) {
      bookings = bookings.filter(b =>
        b.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.service?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Booking.countDocuments(filter);
    return sendSuccess(res, 200, 'All bookings', { bookings, total, page: parseInt(page) });
  } catch (error) {
    next(error);
  }
};

const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 15 } = req.query;

    const [reviews, total] = await Promise.all([
      Review.find()
        .populate('customer', 'name')
        .populate({ path: 'provider', populate: { path: 'user', select: 'name' } })
        .populate({ path: 'booking', populate: { path: 'service', select: 'title' } })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Review.countDocuments(),
    ]);

    return sendSuccess(res, 200, 'All reviews', { reviews, total, page: parseInt(page) });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return sendError(res, 404, 'Review not found');
    return sendSuccess(res, 200, 'Review deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllProviders,
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAllBookingsAdmin,
  getAllReviewsAdmin,
  deleteReview,
};
