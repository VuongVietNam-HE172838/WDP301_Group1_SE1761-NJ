const Category = require('../models/category');
const Dish = require('../models/dish');

// Lấy danh sách categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách dishes theo category
exports.getDishesByCategory = async (req, res) => {
    try {
        const dishes = await Dish.find({ category_id: req.params.categoryId });
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};