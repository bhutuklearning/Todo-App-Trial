import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router();

// User registration route
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  register
);

// User login route
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// User logout route
router.post('/logout', logout);

export default router;