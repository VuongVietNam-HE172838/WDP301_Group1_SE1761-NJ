const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog.controller'); // ✅ Import Controller
const { upload } = require("../controller/blog.controller"); // Import upload từ controller

// Sử dụng các hàm từ blog.controller
router.get('/', blogController.getAllBlogs);   // ✅ Lấy danh sách blog
router.post('/', upload.single("img"), blogController.createBlog); // Tạo blog mới
router.put('/:id', upload.single("img"), blogController.updateBlog); // Cập nhật blog theo ID
router.delete('/:id', blogController.deleteBlog); // Xóa blog theo ID
router.get('/:id', blogController.getBlogById); // Lấy blog theo ID


module.exports = router;
