const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/response');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).sort({ name: 1 });
    return sendSuccess(res, 200, 'Categories fetched', { categories });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, image } = req.body;
    
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return sendError(res, 400, 'Category already exists');
    }

    const category = await Category.create({ name, description, icon, image });
    return sendSuccess(res, 201, 'Category created', { category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    return sendSuccess(res, 200, 'Category updated', { category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, 'Category not found');
    }

    category.active = false;
    await category.save();

    return sendSuccess(res, 200, 'Category deleted (deactivated)');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
