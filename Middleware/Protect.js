const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    // Extract the token from cookies, body, or headers
    const token =
      req.cookies.token || req.body.token || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to access this',
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID from the decoded token to the request
      req.user = { id: decoded.id };

      next(); // Move to the next middleware or route handler
    } catch (error) {
      console.error('JWT Verification Error:', error.message);

      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = protect