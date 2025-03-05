const express = require('express');
const router = express.Router();
const menuController = require('../controller/menu.controller');

// Route để lấy danh sách categories
router.get('/menu', menuController.getCategories);

// Route để lấy dishes theo category
router.get('/:categoryId/dishes', menuController.getDishesByCategory);

module.exports = router;