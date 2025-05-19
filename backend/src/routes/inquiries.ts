import express, { Request, Response, NextFunction } from 'express';
import Inquiry from '../models/Inquiry';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../types/auth';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

// Middleware to verify JWT token
const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Create a new inquiry (public route)
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Creating new inquiry:', req.body);
    const inquiry = new Inquiry({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      company: req.body.company || '',
      message: req.body.message,
      status: 'new'
    });
    
    const savedInquiry = await inquiry.save();
    console.log('Inquiry saved successfully:', savedInquiry);
    res.status(201).json(savedInquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(400).json({ 
      message: 'Invalid inquiry data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all inquiries (protected route)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('Fetching all inquiries');
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ 
      message: 'Error fetching inquiries',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update inquiry status (protected route)
router.patch('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log('Updating inquiry status:', { id, status });

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    console.log('Inquiry updated successfully:', inquiry);
    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ 
      message: 'Error updating inquiry',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete inquiry (protected route)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Deleting inquiry:', id);
    
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    console.log('Inquiry deleted successfully');
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ 
      message: 'Error deleting inquiry',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 