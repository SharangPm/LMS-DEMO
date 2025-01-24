const mongoose = require('mongoose');

// Define the course schema
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    visibility: { type: Boolean, default: true },
    publishDate: { type: Date, required: true },
    video: { type: String, required: true },
    image: { type: String, required: true },
    numberOfLectures: { type: Number, required: true },
    instructorName: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    purchasedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Store the user IDs who bought the course
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'], // Admin approval statuses
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
