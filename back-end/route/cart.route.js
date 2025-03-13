const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, updateCartItem, removeCartItem } = require('../controller/cart.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addItemToCart);
router.put('/update', authMiddleware, updateCartItem);
router.delete('/remove/:cartItemId', authMiddleware, removeCartItem);

module.exports = router;