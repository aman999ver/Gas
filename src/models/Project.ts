import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
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

const Project = mongoose.model('Project', projectSchema);

export default Project; 