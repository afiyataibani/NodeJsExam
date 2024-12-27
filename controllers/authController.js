const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Generate a JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user", // Set default role as 'user' if not provided
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiry
    );

    // Send the token as a cookie
    res.cookie("token", token, { httpOnly: true });

    // Redirect the user to the tasks page after login
    res.redirect("/tasks"); // Or your dashboard page
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User logout
module.exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};
