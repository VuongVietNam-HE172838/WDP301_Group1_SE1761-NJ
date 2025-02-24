require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./route'); 
const db = require('./models');

// Import model Blog
const Blog = require('./models/blog');

// Sử dụng CORS middleware
app.use(cors({
    origin: "http://localhost:3000", 
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
}));

// Hoặc thêm header CORS thủ công nếu không muốn dùng `cors` package
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Middleware để parse JSON
app.use(express.json());

// Kết nối router chính
app.use('/', routes);

// 📌 API Blog
// ✅ Lấy danh sách Blog tại: http://localhost:3000/blog
app.get('/blog', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// ✅ Thêm Blog mới tại: http://localhost:3000/blog
app.post('/blog', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({ title, content });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Kết nối đến MongoDB trước khi khởi động server
db.connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
