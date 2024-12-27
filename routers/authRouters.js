const express = require('express');
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

const router = express.Router();

// Register route
router.get('/register', (req, res) => res.render('register')); // Renders registration form
router.post('/register', registerUser); // Handles registration logic

// Login route
router.get('/login', (req, res) => res.render('login')); // Renders login form
router.post('/login', loginUser); // Handles login logic

// Logout route
router.get('/logout', logoutUser);

module.exports = router;
