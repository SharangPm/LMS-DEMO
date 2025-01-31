const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin'], // Either 'user' or 'admin'
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Auto-generate timestamp
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
