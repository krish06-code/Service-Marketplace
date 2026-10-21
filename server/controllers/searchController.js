const ProviderProfile = require('../models/ProviderProfile');
const Service = require('../models/Service');
const Category = require('../models/Category');
const { sendSuccess } = require('../utils/response');

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return sendSuccess(res, 200, 'Search results', { providers: [], services: [], categories: [] });

    const regex = new RegExp(q, 'i');

    const categories = await Category.find({ name: regex, active: true }).limit(5);
    
    const services = await Service.find({
      isActive: true,
      $or: [{ title: regex }, { description: regex }]
    }).populate('category', 'name').limit(10);

    const providers = await ProviderProfile.find({
      verificationStatus: 'approved',
      $or: [{ skills: regex }, { bio: regex }]
    }).populate('user', 'name avatar').limit(10);

    return sendSuccess(res, 200, 'Search results', { providers, services, categories });
  } catch (error) {
    next(error);
  }
};

const suggest = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return sendSuccess(res, 200, 'Suggestions', { suggestions: [] });
    const regex = new RegExp(q, 'i');

    const categories = await Category.find({ name: regex, active: true }).select('name').limit(3);
    const services = await Service.find({ title: regex, isActive: true }).select('title').limit(2);

    const suggestions = [
      ...categories.map(c => c.name),
      ...services.map(s => s.title)
    ];

    return sendSuccess(res, 200, 'Suggestions', { suggestions });
  } catch (error) {
    next(error);
  }
};

const describeAndMatch = async (req, res, next) => {
  try {
    const { description } = req.body;
    if (!description) return sendSuccess(res, 200, 'Match', { category: null, providers: [] });

    const descLower = description.toLowerCase();
    const keywordMap = {
      'ac|air condition|cooling': 'AC Repair',
      'electric|wire|switch|spark': 'Electrician',
      'pipe|leak|plumb|water|drain': 'Plumbing',
      'clean|sweep|mop|dust': 'Home Cleaning',
      'paint|wall': 'Painting',
      'tutor|teach|math|physics|english|study': 'Tutor',
      'carpenter|furniture|wood': 'Carpentry',
      'trainer|gym|fitness|workout': 'Personal Trainer',
      'photo|shoot|wedding': 'Photography',
      'appliance|washing machine|refrigerator|fridge|microwave': 'Appliance Repair'
    };

    let matchedCategoryName = null;
    for (const [keys, catName] of Object.entries(keywordMap)) {
      const regex = new RegExp(keys, 'i');
      if (regex.test(descLower)) {
        matchedCategoryName = catName;
        break;
      }
    }

    if (!matchedCategoryName) {
      return sendSuccess(res, 200, 'Match', { category: null, providers: [] });
    }

    const category = await Category.findOne({ name: matchedCategoryName, active: true });
    if (!category) return sendSuccess(res, 200, 'Match', { category: null, providers: [] });

    const providers = await ProviderProfile.find({
      categories: category._id,
      verificationStatus: 'approved'
    }).populate('user', 'name avatar').limit(10);

    return sendSuccess(res, 200, 'Match', { category: category.name, providers });
  } catch (error) {
    next(error);
  }
};

module.exports = { search, suggest, describeAndMatch };
