const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone
    });

    if (user.role === 'provider') {
      await ProviderProfile.create({
        user: user._id
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return sendSuccess(res, 201, 'User registered successfully', { token, user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Your account has been deactivated');
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return sendSuccess(res, 200, 'Logged in successfully', { token, user });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  clearTokenCookie(res);
  return sendSuccess(res, 200, 'Logged out successfully');
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.role === 'provider') {
      const providerProfile = await ProviderProfile.findOne({ user: user._id }).populate('categories');
      return sendSuccess(res, 200, 'User fetched', { user, providerProfile });
    }

    return sendSuccess(res, 200, 'User fetched', { user });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid current password');
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    // For now, returning success response as per demo mode
    return sendSuccess(res, 200, 'Password reset email sent (demo mode)');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword
};
