import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/auth';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('No token provided in request');
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      email: string;
      role: string;
    };
    
    console.log('Token verified successfully for user:', decoded.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ 
      message: 'Invalid or expired token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 