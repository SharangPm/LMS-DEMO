const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { 
        type: String, 
        enum: ['user', 'admin', 'instructor'], 
        default: 'user' 
    },
    otp: String,
    otpExpiry: Date,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    progress: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            completedVideos: [Number],
        }
    ],
});

const users = mongoose.model('users', userSchema);
module.exports = users;