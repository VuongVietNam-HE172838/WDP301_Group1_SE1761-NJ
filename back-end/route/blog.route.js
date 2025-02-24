const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog.controller'); // ✅ Import Controller

// Sử dụng các hàm từ blog.controller
router.get('/', blogController.getAllBlogs);   // ✅ Lấy danh sách blog


module.exports = router;
