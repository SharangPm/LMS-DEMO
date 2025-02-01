const express = require('express');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Course = require('../Model/courseModel');
const userController = require('../Controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const Razorpay = require('razorpay');
const User = require('../Model/userSchema');
const Message = require('../Model/messageSchema');
const crypto = require('crypto');
const mongoose = require('mongoose');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/verify-otp', userController.verifyOTP)

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('purchasedCourses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user details', error: err });
  }
});

// Backend route (Express.js)
router.get('/students-with-progress', async (req, res) => {
  try {
    const students = await User.find({ progress: { $exists: true, $not: { $size: 0 } } })
      .populate({
        path: 'progress.courseId',
        select: 'title numberOfLectures' // Include numberOfLectures in the populated data
      });

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students with progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/coursespurchase/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const courses = await Course.find({
      approvalStatus: 'Approved',
      purchasedBy: { $nin: [new mongoose.Types.ObjectId(userId)] },
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/addcourse', upload.fields([{ name: 'videos', maxCount: 10 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, price, publishDate, numberOfLectures, instructorName, level, category } = req.body;

    const course = new Course({
      title,
      description,
      price,
      publishDate,
      numberOfLectures,
      instructorName,
      level,
      category,
      videos: req.files.videos.map(video => video.path), // Map through the array of videos
      image: req.files.image[0].path,
      approvalStatus: 'Pending',
    });

    await course.save();
    res.status(201).json({ message: 'Course submitted for approval.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting course.' });
  }
});

router.get('/pendingcourses', async (req, res) => {
  try {
    const pendingCourses = await Course.find({ approvalStatus: 'Pending' });
    res.status(200).json(pendingCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching pending courses.' });
  }
});

router.put('/approvecourse/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    course.approvalStatus = 'Approved';
    await course.save();

    res.status(200).json({ message: 'Course has been approved.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error approving course.' });
  }
});

router.put('/rejectcourse/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    course.approvalStatus = 'Rejected';
    await course.save();

    res.status(200).json({ message: 'Course has been rejected.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error rejecting course.' });
  }
});

router.get('/user-courses/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('purchasedCourses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.purchasedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching purchased courses' });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

router.get('/selectedCourses', async (req, res) => {
  try {
    const courses = await Course.find().limit(8);
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const courses = await Course.find({_id:course});
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: 'receipt#1',
      payment_capture: 1,
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Unable to create order' });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, courseId, userId } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).json({ message: 'Course or User not found' });
    }

    user.purchasedCourses.push(course);
    course.purchasedBy.push(user);
    await user.save();
    await course.save();

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});


router.post("/send_message", async (req, res) => {
  try {
    const { message, sender } = req.body;

    if (!message || !sender) {
      return res.status(400).json({ success: false, error: "Message and sender are required" });
    }

    if (!['user', 'admin'].includes(sender)) {
      return res.status(400).json({ success: false, error: "Invalid sender type" });
    }

    const newMessage = new Message({ message, sender });
    await newMessage.save();
    
    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API to get chat history
router.get("/get_messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); // Sort by time (oldest to newest)
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/delete_messages", async (req, res) => {
  try {
    await Message.deleteMany(); // Deletes all chat messages
    res.json({ success: true, message: "Chat history deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post('/updateProgress', async (req, res) => {
  const { userId, courseId, videoIndex } = req.body;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      let courseProgress = user.progress.find(p => p.courseId.toString() === courseId);

      if (!courseProgress) {
          user.progress.push({ courseId, completedVideos: [videoIndex] });
      } else {
          if (!courseProgress.completedVideos.includes(videoIndex)) {
              courseProgress.completedVideos.push(videoIndex);
          }
      }

      await user.save();
      res.json({ message: 'Progress updated successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Get total revenue
router.get("/revenue", async (req, res) => {
  try {
    // Aggregate revenue from all approved courses
    const result = await Course.aggregate([
      {
        $match: { approvalStatus: "Approved" }, // Only approved courses
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$price", { $size: "$purchasedBy" }] },
          },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;
    res.status(200).json({ totalRevenue });
  } catch (error) {
    res.status(500).json({ message: "Error calculating revenue" });
  }
});

router.get('/userProgress', async (req, res) => {
  const { userId, courseId } = req.query;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const courseProgress = user.progress.find(p => p.courseId.toString() === courseId);
      res.json({ completedVideos: courseProgress ? courseProgress.completedVideos : [] });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


module.exports = router;