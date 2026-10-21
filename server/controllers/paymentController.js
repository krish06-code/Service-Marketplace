const Payment = require('../models/Payment');
const ProviderProfile = require('../models/ProviderProfile');
const Booking = require('../models/Booking');
const { sendSuccess, sendError } = require('../utils/response');

const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId });
    if (!payment) return sendError(res, 404, 'Payment not found');
    return sendSuccess(res, 200, 'Payment fetched', { payment });
  } catch (error) {
    next(error);
  }
};

const confirmCodPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return sendError(res, 404, 'Payment not found');

    payment.status = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'paid' });

    // Update provider earnings
    const provider = await ProviderProfile.findById(payment.provider);
    if (provider) {
      provider.totalEarnings += payment.amount;
      await provider.save();
    }

    return sendSuccess(res, 200, 'Payment confirmed', { payment });
  } catch (error) {
    next(error);
  }
};

const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .populate('provider', 'user')
      .populate('booking', 'service scheduledDate')
      .sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Payments fetched', { payments });
  } catch (error) {
    next(error);
  }
};

const getProviderEarnings = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) return sendError(res, 404, 'Provider not found');

    const payments = await Payment.find({ provider: provider._id, status: 'paid' })
      .sort({ paidAt: -1 });

    const totalEarnings = payments.reduce((acc, p) => acc + p.amount, 0);

    return sendSuccess(res, 200, 'Earnings fetched', { payments, totalEarnings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentByBooking,
  confirmCodPayment,
  getMyPayments,
  getProviderEarnings
};
