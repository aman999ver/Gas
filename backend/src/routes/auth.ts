import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Admin credentials (in a real app, these would be in a database)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gasgenius.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
// Generate a new hash for the default password
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$8KvmAEXyFE3eBkwNQlXhkuvgvYWULxZYTYPKua0h4qgxNzXA7PV8q';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check email
    if (email !== ADMIN_EMAIL) {
      console.log('Invalid email:', { attemptedEmail: email, validEmail: ADMIN_EMAIL });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // For development purposes, if using the default password, compare directly
    let isValidPassword = false;
    if (password === ADMIN_PASSWORD) {
      isValidPassword = true;
    } else {
      // Otherwise, verify against the hash
      isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    }
    
    console.log('Password verification result:', { isValid: isValidPassword });
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    console.log('Generating token...');
    const token = jwt.sign(
      { 
        _id: '1', // Admin ID
        email,
        role: 'admin'
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    console.log('Login successful');
    res.json({
      token,
      user: {
        _id: '1',
        email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Server error', details: errorMessage });
  }
});

export default router; 