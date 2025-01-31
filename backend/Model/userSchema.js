const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    progress: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            completedVideos: [Number], // Store completed video indexes
        }
    ],
});

const users = mongoose.model('users', userSchema);
module.exports = users;
