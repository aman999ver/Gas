import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  completionDate: Date;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  technologies: [{
    type: String,
    required: true
  }],
  liveUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile App', 'Desktop App', 'UI/UX Design', 'Other']
  },
  completionDate: {
    type: Date,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema); 