const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const { sendSuccess, sendError } = require('../utils/response');

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    
    return sendSuccess(res, 200, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Please upload a file');
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    return sendSuccess(res, 200, 'Avatar updated', { user });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    return sendSuccess(res, 200, 'User found', { user });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return sendSuccess(res, 200, 'Users fetched', {
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    return sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, { user });
  } catch (error) {
    next(error);
  }
};

const toggleFavourite = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const user = await User.findById(req.user._id);

    const isFavourite = user.favourites.includes(providerId);
    
    if (isFavourite) {
      user.favourites = user.favourites.filter(id => id.toString() !== providerId);
    } else {
      user.favourites.push(providerId);
    }

    await user.save();

    return sendSuccess(res, 200, `Provider ${isFavourite ? 'removed from' : 'added to'} favourites`, { favourites: user.favourites });
  } catch (error) {
    next(error);
  }
};

const getFavourites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favourites',
      populate: [
        { path: 'user', select: 'name avatar email phone' },
        { path: 'categories', select: 'name icon' }
      ]
    });

    return sendSuccess(res, 200, 'Favourites fetched', { favourites: user.favourites });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  updateAvatar,
  getUser,
  getAllUsers,
  toggleUserStatus,
  toggleFavourite,
  getFavourites
};
