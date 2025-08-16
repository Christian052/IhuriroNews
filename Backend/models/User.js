const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Editor', 'Writer', 'Contributor'],
    default: 'Writer'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  avatar: {
    type: String,
    default: 'https://placehold.co/40x40/CCCCCC/000000?text=U'
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
