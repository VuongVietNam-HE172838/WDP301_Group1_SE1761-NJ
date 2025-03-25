const Blog = require("../models/blog");
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require("../configs/cloudinary")


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'ImgBlog',
    allowedFormats: ['jdp', 'png', 'jpeg'],
    transformation: [{width: 500, height: 500, crop: 'limit'}]
})

const upload = multer({
    storage: storage
})
module.exports.upload = upload;

// Lấy danh sách tất cả blog
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created_at: -1 }); // Sắp xếp theo ngày mới nhất
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};



// Tạo blog mới
exports.createBlog = async (req, res) => {
    try {
      const { title, content } = req.body;
  
      // Kiểm tra tiêu đề
      const isValidTitle = (title) => /^[a-zA-Z0-9\s]{10,100}$/.test(title);
      if (!isValidTitle(title)) {
        return res.status(400).json({
          message: "Tiêu đề không hợp lệ! Phải có từ 10-100 ký tự và không chứa ký tự đặc biệt."
        });
      }
  
      // Kiểm tra nội dung
      const isValidContent = (content) => content.trim().length >= 50;
      if (!isValidContent(content)) {
        return res.status(400).json({
          message: "Nội dung quá ngắn! Phải có ít nhất 50 ký tự."
        });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "Vui lòng upload ảnh" });
      }
  
      // Lấy URL ảnh đã upload lên Cloudinary
      const imgUrl = req.file.path;  
  
      // Tạo blog mới với URL ảnh
      const newBlog = new Blog({ title, content, img: imgUrl });
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

        // Tìm blog cần cập nhật
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return res.status(404).json({ message: "Blog không tồn tại" });
        }

        let updatedData = { ...req.body };

        // Nếu có file ảnh mới, upload lên Cloudinary
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "blogs",
                });
                updatedData.img = result.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ message: "Lỗi upload ảnh", error: uploadError });
            }
        }

        // Cập nhật blog với dữ liệu mới
        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật blog", error });
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

