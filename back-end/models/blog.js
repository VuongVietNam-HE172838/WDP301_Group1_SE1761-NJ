const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  img: {type: String}
});

module.exports = mongoose.model('Blog', BlogSchema);
