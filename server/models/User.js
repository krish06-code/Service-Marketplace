const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  // password is optional for Google/OAuth users
  password: { type: String, required: false, default: null },
  // Firebase UID stored to link OAuth sign-ins to the same DB record
  googleId: { type: String, default: null },
  role:     { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  phone:    { type: String },
  avatar:   { type: String, default: '' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  // Skip hashing if password wasn't changed or doesn't exist (OAuth users)
  if (!this.isModified('password') || !this.password) {
    return next ? next() : undefined;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  if (next) next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
