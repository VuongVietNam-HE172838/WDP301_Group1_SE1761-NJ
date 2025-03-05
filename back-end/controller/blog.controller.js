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


// Tạo blog mới
exports.createBlog = async (req, res) => {
    try {
        const { title, content, img } = req.body;
        const newBlog = new Blog({ title, content, img });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo blog', error });
    }
};

// Cập nhật blog theo ID
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: 'Blog không tồn tại' });
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật blog', error });
    }
};

// Xóa blog theo ID
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) return res.status(404).json({ message: 'Blog không tồn tại' });
        res.json({ message: 'Xóa blog thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa blog', error });
    }
};

// Lấy blog theo ID
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: 'Blog không tồn tại' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy blog', error });
    }
};

