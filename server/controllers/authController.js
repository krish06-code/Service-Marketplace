const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const { verifyFirebaseToken } = require('../middleware/firebaseAdmin');

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

    // OAuth-only users have no password set
    if (!user.password) {
      return sendError(res, 401, 'This account uses Google Sign-In. Please sign in with Google.');
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

    // OAuth-only users cannot change a password they never had
    if (!user.password) {
      return sendError(res, 400, 'This account uses Google Sign-In and has no password to update.');
    }
    
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

/**
 * POST /api/auth/google
 *
 * Receives a Firebase ID token from the frontend, verifies it server-side
 * with Firebase Admin SDK, then finds or creates the user in MongoDB and
 * returns the application's own JWT — exactly the same token format used
 * by the existing email/password login so all downstream middleware is unchanged.
 */
const googleAuth = async (req, res, next) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return sendError(res, 400, 'Firebase ID token is required');
    }

    // 1. Verify the token with Firebase Admin — this is the security boundary.
    //    We never trust anything the frontend sends without this check.
    let decoded;
    try {
      decoded = await verifyFirebaseToken(idToken);
    } catch (firebaseErr) {
      console.error('[googleAuth] Token verification failed:', firebaseErr.message);
      if (firebaseErr.message && firebaseErr.message.includes('Firebase Admin:')) {
        return sendError(res, 500, `Firebase configuration error: ${firebaseErr.message}`);
      }
      return sendError(res, 401, `Google authentication failed: ${firebaseErr.message}`);
    }

    const { uid, email, name, picture } = decoded;

    if (!email) {
      return sendError(res, 400, 'Google account must have a verified email address.');
    }

    // 2. Find existing user by email OR by googleId
    let user = await User.findOne({ $or: [{ email }, { googleId: uid }] });

    if (user) {
      // User exists — update googleId and avatar if not already set
      let changed = false;
      if (!user.googleId) { user.googleId = uid; changed = true; }
      if (!user.avatar && picture) { user.avatar = picture; changed = true; }
      if (changed) await user.save();

      if (!user.isActive) {
        return sendError(res, 403, 'Your account has been deactivated');
      }
    } else {
      // New user — create account (supports customer or provider signup)
      const assignedRole = role === 'provider' ? 'provider' : 'customer';
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId: uid,
        avatar: picture || '',
        role: assignedRole,
        // password left as null — OAuth user
      });

      if (user.role === 'provider') {
        await ProviderProfile.create({
          user: user._id
        });
      }
    }

    // 3. Issue the app's own JWT, identical to email/password login
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return sendSuccess(res, 200, 'Signed in with Google successfully', { token, user });
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
  forgotPassword,
  googleAuth,
};

