import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Project from '../models/Project';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthenticatedRequest } from '../types/auth';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/projects');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `project-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  async (req: AuthenticatedRequest & { file?: Express.Multer.File }, res: Response) => {
    try {
      console.log('Received project creation request:', req.body);

      if (!req.file) {
        return res.status(400).json({ message: 'Project image is required' });
      }

      const requiredFields = ['title', 'description', 'technologies', 'category', 'completionDate'];
      const missingFields = requiredFields.filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(', ')}`,
          receivedFields: Object.keys(req.body)
        });
      }

      const completionDate = new Date(req.body.completionDate);
      if (isNaN(completionDate.getTime())) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Invalid completion date format' });
      }

      const technologies = req.body.technologies
        .split(',')
        .map((tech: string) => tech.trim())
        .filter((tech: string) => tech.length > 0);

      if (technologies.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'At least one technology is required' });
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

      const project = new Project(projectData);
      await project.save();

      const projectResponse = project.toObject();
      projectResponse.imageUrl = `${req.protocol}://${req.get('host')}${project.imageUrl}`;

      res.status(201).json(projectResponse);
    } catch (error: any) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

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
  }
);

// Update project (admin only)
router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  async (req: AuthenticatedRequest & { file?: Express.Multer.File }, res: Response) => {
    try {
      const technologies = typeof req.body.technologies === 'string'
        ? req.body.technologies.split(',').map((tech: string) => tech.trim())
        : [];

      const projectData = {
        ...req.body,
        technologies
      };

      if (req.file) {
        projectData.imageUrl = `/uploads/projects/${req.file.filename}`;

        const oldProject = await Project.findById(req.params.id);
        if (oldProject?.imageUrl) {
          const urlPath = oldProject.imageUrl.startsWith('http')
            ? new URL(oldProject.imageUrl).pathname
            : oldProject.imageUrl;
          const oldImagePath = path.join(__dirname, '../../public', urlPath);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const project = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true });

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
  }
);

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.imageUrl) {
      try {
        const urlPath = project.imageUrl.startsWith('http')
          ? new URL(project.imageUrl).pathname
          : project.imageUrl;
        const imagePath = path.join(__dirname, '../../public', urlPath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    await project.deleteOne();
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
