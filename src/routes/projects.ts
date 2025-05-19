import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Project from '../models/Project';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Define custom interface for multer request
type MulterRequest = Request & { file?: Express.Multer.File };

const router = express.Router();

// Ensure upload directory exists
const uploadDir = './public/uploads/projects';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Create a safe filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Validate file type
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'));
  }
});

// Error handling middleware for multer
const handleMulterError = (err: any, req: Request, res: Response, next: Function) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Get all projects (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;
    const filter: any = {};
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ completionDate: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get single project (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create project (admin only)
router.post('/', authenticateToken, upload.single('image'), handleMulterError, async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'technologies', 'category', 'completionDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      // Remove uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const projectData = {
      ...req.body,
      imageUrl: `/uploads/projects/${req.file.filename}`,
      technologies: req.body.technologies ? req.body.technologies.split(',').map((tech: string) => tech.trim()) : []
    };

    console.log('Attempting to save project with data:', projectData);

    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error: any) {
    // Remove uploaded file if save fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error saving project:', error);
    res.status(400).json({ 
      message: 'Error creating project', 
      error: error.message || 'Unknown error'
    });
  }
});

// Update project (admin only)
router.put('/:id', authenticateToken, upload.single('image'), handleMulterError, async (req: MulterRequest, res: Response) => {
  try {
    const projectData = {
      ...req.body,
      technologies: req.body.technologies ? req.body.technologies.split(',').map((tech: string) => tech.trim()) : []
    };

    if (req.file) {
      projectData.imageUrl = `/uploads/projects/${req.file.filename}`;
      
      // Get old project to delete its image
      const oldProject = await Project.findById(req.params.id);
      if (oldProject && oldProject.imageUrl) {
        const oldImagePath = path.join('./public', oldProject.imageUrl);
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
      // Remove uploaded file if project not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error: any) {
    // Remove uploaded file if update fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error updating project:', error);
    res.status(400).json({ 
      message: 'Error updating project',
      error: error.message || 'Unknown error'
    });
  }
});

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete the project's image file
    if (project.imageUrl) {
      const imagePath = path.join('./public', project.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export default router; 