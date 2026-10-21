const Service = require('../models/Service');
const ProviderProfile = require('../models/ProviderProfile');
const { sendSuccess, sendError } = require('../utils/response');

const createService = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) return sendError(res, 404, 'Provider profile not found');

    const title = req.body.title || req.body.name;
    const { category, description, price, pricingType, duration } = req.body;
    
    const service = await Service.create({
      provider: provider._id,
      category,
      title,
      description,
      price,
      pricingType,
      duration
    });

    return sendSuccess(res, 201, 'Service created', { service });
  } catch (error) {
    next(error);
  }
};

const getServicesByProvider = async (req, res, next) => {
  try {
    const rawId = req.params.providerId || req.params.id;
    let providerProfile = await ProviderProfile.findById(rawId);
    if (!providerProfile) {
      providerProfile = await ProviderProfile.findOne({ user: rawId });
    }
    const targetId = providerProfile ? providerProfile._id : rawId;
    const services = await Service.find({ provider: targetId, isActive: true })
      .populate('category', 'name icon');
    return sendSuccess(res, 200, 'Services fetched', { services });
  } catch (error) {
    next(error);
  }
};

const getMyServices = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    if (!provider) return sendError(res, 404, 'Provider profile not found');

    const services = await Service.find({ provider: provider._id, isActive: true })
      .populate('category', 'name');
    return sendSuccess(res, 200, 'My services fetched', { services });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: provider._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) return sendError(res, 404, 'Service not found or unauthorized');

    return sendSuccess(res, 200, 'Service updated', { service });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const provider = await ProviderProfile.findOne({ user: req.user._id });
    
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: provider._id },
      { isActive: false },
      { new: true }
    );
    
    if (!service) return sendError(res, 404, 'Service not found or unauthorized');

    return sendSuccess(res, 200, 'Service deleted');
  } catch (error) {
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, q, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .populate('provider', 'user averageRating totalReviews')
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);

    return sendSuccess(res, 200, 'Services fetched', {
      services,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getServicesByProvider,
  getMyServices,
  updateService,
  deleteService,
  getAllServices
};
