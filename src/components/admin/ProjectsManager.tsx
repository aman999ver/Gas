import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';
import { config } from '../../config';

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  category: string;
  completionDate: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string;
  category: string;
  completionDate: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const CATEGORIES = [
  'Web Development',
  'Mobile App',
  'Desktop App',
  'UI/UX Design',
  'Other'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    technologies: '',
    category: 'Web Development',
    completionDate: new Date().toISOString().split('T')[0],
    liveUrl: '',
    githubUrl: '',
    featured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/api/projects');
      setProjects(response.data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error(error.response?.data?.message || 'Error fetching projects');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.technologies.trim()) {
      newErrors.technologies = 'At least one technology is required';
    }
    if (!formData.completionDate) {
      newErrors.completionDate = 'Completion date is required';
    }

    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid URL';
    }
    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL';
    }

    if (!editingId && !selectedFile) {
      newErrors.image = 'Image is required';
    } else if (selectedFile) {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        newErrors.image = 'Only JPEG, PNG, and WebP images are allowed';
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        newErrors.image = 'File size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      category: 'Web Development',
      completionDate: new Date().toISOString().split('T')[0],
      liveUrl: '',
      githubUrl: '',
      featured: false
    });
    setSelectedFile(null);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      const formDataWithFixedTechnologies = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).join(',')
      };
      
      Object.entries(formDataWithFixedTechnologies).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      // Add debugging logs
      console.log('Form Data Contents:');
      Array.from(formDataToSend.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      if (editingId) {
        await axiosInstance.put(`/api/projects/${editingId}`, formDataToSend);
        toast.success('Project updated successfully');
      } else {
        await axiosInstance.post('/api/projects', formDataToSend);
        toast.success('Project created successfully');
      }
      
      resetForm();
      fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Error saving project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      category: project.category,
      completionDate: new Date(project.completionDate).toISOString().split('T')[0],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured
    });
    setEditingId(project._id);
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Attempting to delete project:', id);
      
      const response = await axiosInstance.delete(`/api/projects/${id}`);
      console.log('Delete response:', response.data);
      
      toast.success('Project deleted successfully');
      await fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting project';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.technologies ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="React, TypeScript, Node.js"
              required
            />
            {errors.technologies && (
              <p className="mt-1 text-sm text-red-500">{errors.technologies}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md border-gray-300"
              required
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Completion Date
            </label>
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.completionDate ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.completionDate && (
              <p className="mt-1 text-sm text-red-500">{errors.completionDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Image {!editingId && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}
              required={!editingId}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: JPEG, PNG, WebP. Max size: 5MB
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Live URL
            </label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.liveUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com"
            />
            {errors.liveUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.liveUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.githubUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://github.com/username/repo"
            />
            {errors.githubUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.githubUrl}</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured Project
              </span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Saving...'
                : editingId
                ? 'Update Project'
                : 'Add Project'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Existing Projects</h2>
        <div className="grid gap-6">
          {projects.map(project => (
            <div
              key={project._id}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Technologies: {project.technologies.join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  Category: {project.category}
                </p>
                {project.featured && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-white bg-primary-600 rounded">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={isSubmitting}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsManager; 