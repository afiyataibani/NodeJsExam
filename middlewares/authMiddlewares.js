const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.redirect("/auth/login"); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to req
    res.locals.role = decoded.role; // Attach role to res.locals for views
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.clearCookie("token"); // Clear the invalid token
    res.redirect("/auth/login");
  }
};
