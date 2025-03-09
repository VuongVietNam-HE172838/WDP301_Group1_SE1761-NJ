const express = require('express');
const router = express.Router();
const menuController = require('../controller/menu.controller');

// Route để lấy danh sách categories
router.get('/menu', menuController.getCategories);

// Route để lấy dishes theo category
router.get('/:categoryId/dishes', menuController.getDishesByCategory);



router.get('/category/:id', menuController.getCategoryById);
router.post('/category', menuController.createCategory);
router.put('/category/:id', menuController.updateCategory);
router.delete('/category/:id', menuController.deleteCategory);

// 📌 Lấy danh sách tất cả món ăn
router.get('/dishes', menuController.getAllDishes);
router.get('/dishes/:id', menuController.getDishById);
router.post('/dishes', menuController.createDish);
router.put('/dishes/:id', menuController.updateDish);
router.delete('/dishes/:id', menuController.deleteDish);
module.exports = router;