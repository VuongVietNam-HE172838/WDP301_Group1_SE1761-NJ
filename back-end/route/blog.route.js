const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog.controller'); // ✅ Import Controller

// Sử dụng các hàm từ blog.controller
router.get('/', blogController.getAllBlogs);   // ✅ Lấy danh sách blog
router.post('/', blogController.createBlog); // Tạo blog mới
router.put('/:id', blogController.updateBlog); // Cập nhật blog theo ID
router.delete('/:id', blogController.deleteBlog); // Xóa blog theo ID
router.get('/:id', blogController.getBlogById); // Lấy blog theo ID


module.exports = router;
