const Blog = require("../models/blog");

// Lấy danh sách tất cả blog
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

