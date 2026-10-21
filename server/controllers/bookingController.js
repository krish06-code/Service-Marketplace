const Booking = require('../models/Booking');
const ProviderProfile = require('../models/ProviderProfile');
const Service = require('../models/Service');
const Payment = require('../models/Payment');
const Conversation = require('../models/Conversation');
const { createNotification } = require('../utils/notifications');
const { sendSuccess, sendError } = require('../utils/response');

const createBooking = async (req, res, next) => {
  try {
    const providerId = req.body.providerId || req.body.provider;
    const serviceId = req.body.serviceId || req.body.service;
    const scheduledDate = req.body.scheduledDate || req.body.date;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    if (!startTime && req.body.timeSlot) {
      const parts = req.body.timeSlot.split('-');
      startTime = parts[0]?.trim();
      endTime = parts[1]?.trim() || startTime;
    }
    const address = req.body.address;
    const customerNotes = req.body.customerNotes || req.body.notes;
    const price = req.body.price;

    let provider = await ProviderProfile.findById(providerId);
    if (!provider) {
      provider = await ProviderProfile.findOne({ user: providerId });
    }
    if (!provider || provider.verificationStatus !== 'approved') {
      return sendError(res, 400, 'Provider not available');
    }

    const actualProviderId = provider._id;
    let service = await Service.findOne({ _id: serviceId, provider: actualProviderId });
    if (!service) {
      service = await Service.findById(serviceId);
    }
    if (!service && serviceId) {
      return sendError(res, 400, 'Invalid service');
    }

    // Check Double Booking
    const dateStr = new Date(scheduledDate).toISOString().split('T')[0];
    const existingBookings = await Booking.find({
      provider: actualProviderId,
      status: { $nin: ['cancelled', 'rejected'] },
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$scheduledDate" } },
          dateStr
        ]
      }
    });

    const hasConflict = existingBookings.some(b => {
      return (startTime >= b.startTime && startTime < b.endTime) ||
             (endTime > b.startTime && endTime <= b.endTime) ||
             (startTime <= b.startTime && endTime >= b.endTime);
    });

    if (hasConflict) {
      return sendError(res, 409, 'Time slot is already booked');
    }

    const booking = await Booking.create({
      customer: req.user._id,
      provider: actualProviderId,
      service: service ? service._id : serviceId,
      scheduledDate,
      startTime: startTime || '10:00 AM',
      endTime: endTime || '11:00 AM',
      address,
      customerNotes,
      price: price || (service ? service.price : 499),
      status: 'pending',
      paymentMethod: req.body.paymentMethod || 'cod'
    });

    await Payment.create({
      booking: booking._id,
      customer: req.user._id,
      provider: providerId,
      amount: price,
      status: 'pending',
      paymentMethod: 'cod'
    });

    await createNotification(
      provider.user, 
      'booking', 
      'New Booking Request', 
      `You have a new booking request for ${scheduledDate}`,
      { bookingId: booking._id }
    );

    return sendSuccess(res, 201, 'Booking created successfully', { booking });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { customer: req.user._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate({ path: 'provider', populate: { path: 'user', select: 'name avatar phone' } })
      .populate('service', 'title')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ scheduledDate: -1 });

    const total = await Booking.countDocuments(query);

    return sendSuccess(res, 200, 'Bookings fetched', {
      bookings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone avatar')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name email phone avatar' } })
      .populate('service');

    if (!booking) return sendError(res, 404, 'Booking not found');

    return sendSuccess(res, 200, 'Booking fetched', { booking });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
    if (!booking) return sendError(res, 404, 'Booking not found');

    if (!['pending', 'accepted'].includes(booking.status)) {
      return sendError(res, 400, 'Cannot cancel booking at this stage');
    }

    booking.status = 'cancelled';
    await booking.save();

    const provider = await ProviderProfile.findById(booking.provider);
    await createNotification(
      provider.user,
      'booking',
      'Booking Cancelled',
      'A booking was cancelled by the customer.',
      { bookingId: booking._id }
    );

    return sendSuccess(res, 200, 'Booking cancelled', { booking });
  } catch (error) {
    next(error);
  }
};

const getProviderBookings = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) return sendError(res, 404, 'Provider profile not found');

    const { status, page = 1, limit = 10 } = req.query;
    let query = { provider: provider._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('customer', 'name avatar phone')
      .populate('service', 'title')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ scheduledDate: -1 });

    const total = await Booking.countDocuments(query);

    return sendSuccess(res, 200, 'Bookings fetched', {
      bookings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // accepted, rejected, in_progress, completed
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) return sendError(res, 404, 'Provider profile not found');

    const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
    if (!booking) return sendError(res, 404, 'Booking not found');

    // State machine basic checks
    if (status === 'accepted' && booking.status !== 'pending') return sendError(res, 400, 'Invalid status transition');
    if (status === 'rejected' && booking.status !== 'pending') return sendError(res, 400, 'Invalid status transition');
    if (status === 'in_progress' && booking.status !== 'confirmed' && booking.status !== 'accepted') return sendError(res, 400, 'Invalid status transition');
    if (status === 'completed' && booking.status !== 'in_progress') return sendError(res, 400, 'Invalid status transition');

    booking.status = status;
    if (status === 'completed') {
      booking.completedAt = new Date();
      provider.completedJobs += 1;
      await provider.save();
      
      // Assume COD is paid when completed
      if (booking.paymentMethod === 'cod') {
        booking.paymentStatus = 'paid';
        await Payment.findOneAndUpdate({ booking: booking._id }, { status: 'paid', paidAt: new Date() });
      }
    }

    await booking.save();

    let notificationMsg = '';
    if (status === 'accepted') {
      notificationMsg = 'Your booking has been accepted.';
      // Create conversation
      let conv = await Conversation.findOne({ booking: booking._id });
      if (!conv) {
        await Conversation.create({
          participants: [booking.customer, provider.user],
          booking: booking._id
        });
      }
    } else if (status === 'rejected') {
      notificationMsg = 'Your booking request was rejected.';
    } else if (status === 'completed') {
      notificationMsg = 'Your booking has been completed.';
    }

    if (notificationMsg) {
      await createNotification(booking.customer, 'booking', 'Booking Update', notificationMsg, { bookingId: booking._id });
    }

    return sendSuccess(res, 200, 'Booking status updated', { booking });
  } catch (error) {
    next(error);
  }
};

const adminGetAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate({ path: 'provider', populate: { path: 'user', select: 'name' } })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments();
    return sendSuccess(res, 200, 'All bookings', { bookings, total, page, pages: Math.ceil(total/limit) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getProviderBookings,
  updateBookingStatus,
  adminGetAllBookings
};
