const mongoose = require('mongoose');

const newsPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: String,
  category: String,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  image: String, // <-- add this line for image URL
  createdAt: { type: Date, default: Date.now }, // better to use Date type
  updatedAt: { type: Date, default: Date.now },
});

// Optional: Middleware to update updatedAt automatically on save
newsPostSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('NewsPost', newsPostSchema);
