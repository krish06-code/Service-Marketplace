const ProviderProfile = require('../models/ProviderProfile');
const Booking = require('../models/Booking');
const { sendSuccess, sendError } = require('../utils/response');
const { generateSlots } = require('../utils/availability');

const mongoose = require('mongoose');
const Category = require('../models/Category');

const getAllProviders = async (req, res, next) => {
  try {
    const { category, city, minRating, maxPrice, verificationStatus = 'approved', q, search, page = 1, limit = 10 } = req.query;
    
    let query = { verificationStatus };
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.categories = category;
      } else {
        const cat = await Category.findOne({
          $or: [{ slug: category }, { name: new RegExp('^' + category + '$', 'i') }]
        });
        if (cat) {
          query.categories = cat._id;
        } else {
          query.categories = new mongoose.Types.ObjectId(); // Non-matching ID to return empty array cleanly
        }
      }
    }
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (minRating) query.averageRating = { $gte: parseFloat(minRating) };
    if (maxPrice) query.startingPrice = { $lte: parseFloat(maxPrice) };

    let providers = await ProviderProfile.find(query)
      .populate('user', 'name avatar')
      .populate('categories', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ averageRating: -1 });

    const searchTerm = (q || search || '').trim().toLowerCase();
    if (searchTerm) {
      providers = providers.filter(p => 
        p.user?.name?.toLowerCase().includes(searchTerm) || 
        p.skills?.some(s => s.toLowerCase().includes(searchTerm)) ||
        p.bio?.toLowerCase().includes(searchTerm)
      );
    }

    const total = await ProviderProfile.countDocuments(query);

    return sendSuccess(res, 200, 'Providers fetched', {
      providers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

const getProviderById = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('categories');
    
    if (!provider) {
      return sendError(res, 404, 'Provider not found');
    }

    return sendSuccess(res, 200, 'Provider fetched', { provider });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user._id })
      .populate('categories');
    
    if (!profile) {
      return sendError(res, 404, 'Provider profile not found');
    }

    return sendSuccess(res, 200, 'Profile fetched', { profile });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const { bio, experience, skills, location, serviceRadius, categories, startingPrice } = req.body;
    
    const updateData = { bio, experience, skills, location, serviceRadius, categories };
    if (startingPrice !== undefined) updateData.startingPrice = startingPrice;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('categories');

    return sendSuccess(res, 200, 'Profile updated', { profile });
  } catch (error) {
    next(error);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const { availability, slotDuration, unavailableDates } = req.body;
    
    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      { availability, slotDuration, unavailableDates },
      { new: true }
    );

    return sendSuccess(res, 200, 'Availability updated', { profile });
  } catch (error) {
    next(error);
  }
};

const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return sendError(res, 400, 'Date is required');

    const provider = await ProviderProfile.findById(req.params.id);
    if (!provider) return sendError(res, 404, 'Provider not found');

    const targetDateStr = date.split('T')[0];

    const bookings = await Booking.find({
      provider: provider._id,
      status: { $in: ['pending', 'accepted', 'confirmed', 'in_progress'] },
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$scheduledDate" } },
          targetDateStr
        ]
      }
    });

    const slots = generateSlots(
      provider.availability,
      provider.unavailableDates || [],
      bookings,
      date,
      provider.slotDuration
    );

    return sendSuccess(res, 200, 'Slots fetched', { slots });
  } catch (error) {
    next(error);
  }
};

const uploadProviderImage = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, 'Please upload a file');
    // Assuming you want to add gallery images or similar
    const imageUrl = `/uploads/providers/${req.file.filename}`;
    return sendSuccess(res, 200, 'Image uploaded', { imageUrl });
  } catch (error) {
    next(error);
  }
};

const getProviderStats = async (req, res, next) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user._id });
    if (!profile) return sendError(res, 404, 'Profile not found');

    const totalBookings = await Booking.countDocuments({ provider: profile._id });
    const pendingRequests = await Booking.countDocuments({ provider: profile._id, status: 'pending' });

    const statsData = {
      totalBookings,
      completedJobs: profile.completedJobs || 0,
      totalEarnings: profile.totalEarnings || 0,
      averageRating: profile.averageRating || 0,
      pendingRequests
    };

    return sendSuccess(res, 200, 'Stats fetched', {
      ...statsData,
      stats: statsData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  getMyProfile,
  updateMyProfile,
  updateAvailability,
  getAvailableSlots,
  uploadProviderImage,
  getProviderStats
};
