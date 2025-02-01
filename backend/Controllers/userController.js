const users = require('../Model/userSchema');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  console.log("inside register function");
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Create a new user
    const newUser = new users({
      username,
      email,
      password, // Ensure the password is hashed in the model's pre-save hook
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.jwt_secret);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Registration successful!",
      user: newUser,
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};
// Updated login controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Handle admin/instructor login
    if (role === 'admin' || role === 'instructor') {
      const envEmail = process.env[`${role.toUpperCase()}_EMAIL`];
      const envPassword = process.env[`${role.toUpperCase()}_PASSWORD`];

      if (email === envEmail && password === envPassword) {
        const token = jwt.sign(
          { role, email }, 
          process.env.jwt_secret,
          { expiresIn: '1h' }
        );
        return res.status(200).json({
          token,
          role,
          email,
          message: `${role} login successful`
        });
      }
      return res.status(401).json({ message: `Invalid ${role} credentials` });
    }

    // Handle regular user login with OTP
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

  

    // Generate OTP (existing flow)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await users.updateOne(
      { email },
      { $set: { otp, otpExpiry } }
    );

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }
      res.status(200).json({ 
        message: "OTP sent to your email",
        email: existingUser.email 
      });
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error during login" });
  }
};
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const existingUser = await users.findOne({ 
      email,
      otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!existingUser) {
      return res.status(406).json({ message: "Invalid or expired OTP" });
    }

    await users.updateOne(
      { email },
      { $unset: { otp: "", otpExpiry: "" } }
    );

    const token = jwt.sign(
      { userId: existingUser._id, role: existingUser.role }, 
      process.env.jwt_secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      existingUser,
      token,
      message: "OTP verified successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};