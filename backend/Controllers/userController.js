const users = require('../Model/userSchema');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log("inside register function");
  const { username, email, password } = req.body;

  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(406).json("User already exists. Please login.");
    } else {
      const newUser = new users({
        username,
        email,
        password,
      });
      await newUser.save();

      // Generate token after user registration
      const token = jwt.sign({ userId: newUser._id }, process.env.jwt_secret);

      res.status(200).json({ newUser, token });  // Return user and token
    }
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await users.findOne({ email, password });
    if (existingUser) {
      // Generate token after successful login
      const token = jwt.sign({ userId: existingUser._id }, process.env.jwt_secret);
      res.status(200).json({ existingUser, token });
    } else {
      res.status(406).json("Invalid email/password");
    }
  } catch (err) {
    res.status(401).json(err);
  }
};
