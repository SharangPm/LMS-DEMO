const express = require('express');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Course = require('../Model/courseModel');
const userController = require('../Controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const Razorpay = require('razorpay');
const User = require('../Model/userSchema');
const crypto = require('crypto');
const mongoose = require('mongoose');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store files
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // Ensure unique filenames
    );
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Register route
router.post('/register', userController.register);

// Login route
router.post('/login', userController.login);


router.get('/user/:id', async (req, res) => {
  try {
    // Find the user by ID and populate the purchasedCourses field with course details
    const user = await User.findById(req.params.id).populate('purchasedCourses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);  // Respond with user data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user details', error: err });
  }
});
router.get('/coursespurchase/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   

    // Fetch courses not purchased by the user
    const courses = await Course.find({
      approvalStatus: 'Approved', // Only approved courses
      purchasedBy: { $nin: [new mongoose.Types.ObjectId(userId)] }, // Use 'new' to properly create ObjectId
    });



    res.status(200).json(courses); // Send the courses data as JSON response
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Add a new course (status defaults to "Pending")
router.post('/addcourse', upload.fields([{ name: 'video' }, { name: 'image' }]), async (req, res) => {
  try {
    const { title, description, price, publishDate, numberOfLectures, instructorName, level, category } = req.body;

    // Create new course
    const course = new Course({
      title,
      description,
      price,
      publishDate,
      numberOfLectures,
      instructorName,
      level,
      category,
      video: req.files.video[0].path, // Save file paths
      image: req.files.image[0].path, // Save file paths
      approvalStatus: 'Pending', // Set status to pending
    });

    await course.save();
    res.status(201).json({ message: 'Course submitted for approval.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting course.' });
  }
});

// Fetch all pending courses (for admin)
router.get('/pendingcourses', async (req, res) => {
  try {
    const pendingCourses = await Course.find({ approvalStatus: 'Pending' });
    res.status(200).json(pendingCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching pending courses.' });
  }
});

// Approve or reject a course
// Approve a Course
router.put('/approvecourse/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Set the course's status to "Approved"
    course.approvalStatus = 'Approved';
    await course.save();

    res.status(200).json({ message: 'Course has been approved.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error approving course.' });
  }
});


// Reject a Course
router.put('/rejectcourse/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Update the course's status to "Rejected"
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

    // Find the user in the database
    const user = await User.findById(userId).populate('purchasedCourses');

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // The `purchasedCourses` array will contain the courses purchased by the user
    res.status(200).json(user.purchasedCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching purchased courses' });
  }
});


// Route to fetch all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from the database
    res.status(200).json(courses); // Send the courses data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' }); // Error handling
  }
});
router.get('/selectedCourses', async (req, res) => {
  try {
    const courses = await Course.find().limit(8); // Fetch all courses from the database
    res.status(200).json(courses); // Send the courses data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' }); // Error handling
  }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const courses = await Course.find({_id:course}); // Fetch all courses from the database
    res.status(200).json(courses); // Send the courses data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' }); // Error handling
  }
});



router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert amount to paise
      currency: 'INR',
      receipt: 'receipt#1',
      payment_capture: 1,
    });
    
    res.json(order); // Send the order details back to the frontend
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

    // Add course to the user's purchased courses
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

module.exports = router;