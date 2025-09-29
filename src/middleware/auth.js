
import { findById } from '../models/UsersModel';

/**

/**
 * SESSION-BASED AUTHENTICATION MIDDLEWARE
 *
 * This checks if the user is logged in by looking for a userId in the session (from cookies).
 * If the user is logged in, it loads their info and attaches it to req.user.
 * If not, it blocks access and asks them to log in.
 */
const authenticate = async (req, res, next) => {
  // If there's no session or no userId in the session, block access
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in first.'
    });
  }

  // Find the user in the database
  const user = await findById(req.session.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found. Please log in again.'
    });
  }

  // Attach user info to the request for later use
  req.user = user;
  next();
};

/**

/**
 * AUTHORIZATION MIDDLEWARE - Checks if the user has the right type (admin/rentor)
 */
const authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in first.'
      });
    }
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This feature requires ${userTypes.join(' or ')} privileges.`
      });
    }
    next();
  };
};

/**
 * EXPORT THE FUNCTIONS
 */
export default { authenticate, authorize };