const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// Passport Google OAuth Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ email: profile.emails[0].value });
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create new user if not already registered
      const newUser = new User({
        email: profile.emails[0].value,
        username: profile.displayName,
        password: null,  // No password since OAuth is used
        accountType: 'Admin'
      });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, false, err.message);
    }
  }
));

// Local SignUp and Login Routes
const signupAdmin = async (req, res) => {
  const { email, password, username, instituteName } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      instituteName,
      accountType: "Admin",
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ _id: newUser._id, accountType: newUser.accountType }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || user.accountType !== 'Admin') {
      return res.status(400).json({ message: "Invalid credentials or not an admin" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ _id: user._id, accountType: user.accountType }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// OAuth Login
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  session: false
});

const googleAuthSuccess = (req, res) => {
  // Generate JWT after successful OAuth login
  const token = jwt.sign({ _id: req.user._id, accountType: req.user.accountType }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    message: "OAuth login successful",
    token,
  });
};


module.exports = {
  signupAdmin,
  loginAdmin,
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess
};
