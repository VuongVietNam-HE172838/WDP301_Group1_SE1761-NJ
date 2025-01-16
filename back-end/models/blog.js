const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  posted_by: { type: Schema.Types.ObjectId, ref: 'AccountDetail', required: true },
  deleted_flag: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;