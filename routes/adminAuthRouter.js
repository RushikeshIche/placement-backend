const express = require('express');
const passport = require('passport');
const { signupAdmin, loginAdmin, googleAuth, googleAuthCallback, googleAuthSuccess } = require('../controllers/AdminAuth.js');

const adminRouter = express.Router();

// Sign Up Route
adminRouter.post('/adminsignup', signupAdmin);

// Login Route
adminRouter.post('/adminlogin', loginAdmin);

// Google OAuth Routes
adminRouter.get('/auth/google', googleAuth);
adminRouter.get('/auth/google/callback', googleAuthCallback, googleAuthSuccess);

module.exports = adminRouter;
