import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Project from '../models/Project';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthenticatedRequest } from '../types/auth';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/projects');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    // Add full URLs to the response
    const projectsWithFullUrls = projects.map(project => {
      const projectObj = project.toObject();
      projectObj.imageUrl = `${req.protocol}://${req.get('host')}${project.imageUrl}`;
      return projectObj;
    });
    
    res.json(projectsWithFullUrls);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create new project (admin only)
router.post('/', authenticateToken, upload.single('image'), async (req: AuthenticatedRequest & { file?: Express.Multer.File }, res: Response) => {
  try {
    // Add request debugging
    console.log('Received project creation request:');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'Project image is required' });
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'technologies', 'category', 'completionDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        receivedFields: Object.keys(req.body)
      });
    }

    // Parse and validate the completion date
    const completionDate = new Date(req.body.completionDate);
    if (isNaN(completionDate.getTime())) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'Invalid completion date format'
      });
    }

    // Process technologies array
    const technologies = req.body.technologies
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);

    if (technologies.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'At least one technology is required'
      });
    }

    const projectData = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      imageUrl: `/uploads/projects/${req.file.filename}`,
      technologies,
      category: req.body.category,
      completionDate,
      featured: req.body.featured === 'true',
      liveUrl: req.body.liveUrl || undefined,
      githubUrl: req.body.githubUrl || undefined
    };

    console.log('Attempting to save project with data:', projectData);

    const project = new Project(projectData);
    await project.save();
    
    // Add the full URL to the response
    const projectResponse = project.toObject();
    projectResponse.imageUrl = `${req.protocol}://${req.get('host')}${project.imageUrl}`;
    
    console.log('Project saved successfully:', projectResponse);
    res.status(201).json(projectResponse);
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    // Clean up uploaded file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(400).json({ 
      message: 'Error creating project',
      error: error.message || 'Unknown error'
    });
  }
});

// Update project (admin only)
router.put('/:id', authenticateToken, upload.single('image'), async (req: AuthenticatedRequest & { file?: Express.Multer.File }, res: Response) => {
  try {
    const projectData = {
      ...req.body,
      technologies: req.body.technologies.split(',').map((tech: string) => tech.trim())
    };

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      projectData.imageUrl = `${baseUrl}/uploads/projects/${req.file.filename}`;
      
      // Delete old image
      const oldProject = await Project.findById(req.params.id);
      if (oldProject?.imageUrl) {
        // Extract the file path from the full URL
        const urlPath = new URL(oldProject.imageUrl).pathname;
        const oldImagePath = path.join(__dirname, '../../public', urlPath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true }
    );

    if (!project) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error updating project:', error);
    res.status(400).json({ message: 'Error updating project' });
  }
});

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('Attempting to delete project:', req.params.id);
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found:', req.params.id);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete project image
    if (project.imageUrl) {
      try {
        let imagePath;
        if (project.imageUrl.startsWith('http')) {
          // Handle full URLs
          const urlPath = new URL(project.imageUrl).pathname;
          imagePath = path.join(__dirname, '../../public', urlPath);
        } else {
          // Handle relative paths
          imagePath = path.join(__dirname, '../../public', project.imageUrl);
        }
        
        console.log('Attempting to delete image at:', imagePath);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Successfully deleted image file');
        } else {
          console.log('Image file not found at:', imagePath);
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
        // Continue with project deletion even if image deletion fails
      }
    }

    await project.deleteOne();
    console.log('Project deleted successfully');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      message: 'Error deleting project',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 