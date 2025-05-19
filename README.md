# GAS Genius Apps Solutions Website

A modern, responsive website for GAS Genius Apps Solutions built with React, TypeScript, and Express.js.

## Features

- Modern, animated landing page
- Detailed services section
- Contact form with backend integration
- Admin panel for managing inquiries
- JWT-based authentication
- Responsive design for all devices
- Framer Motion animations

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API requests

### Backend
- Express.js with TypeScript
- MongoDB with Mongoose
- JWT for authentication
- CORS for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd gas-genius
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
npm install
\`\`\`

3. Install backend dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

4. Create a .env file in the backend directory with the following variables:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gas-genius
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@gasgenius.com
ADMIN_PASSWORD=admin123
\`\`\`

5. Start the backend server:
\`\`\`bash
# In the backend directory
npm run dev
\`\`\`

6. Start the frontend development server:
\`\`\`bash
# In the root directory
npm start
\`\`\`

The application will be available at http://localhost:3000

## Admin Access

To access the admin panel:
1. Navigate to /admin/login
2. Use the following credentials:
   - Email: admin@gasgenius.com
   - Password: admin123

## Building for Production

1. Build the frontend:
\`\`\`bash
# In the root directory
npm run build
\`\`\`

2. Build the backend:
\`\`\`bash
# In the backend directory
npm run build
\`\`\`

## Deployment

### Frontend
The built frontend files will be in the `build` directory. Deploy these files to your web server or hosting service.

### Backend
The compiled backend files will be in the `backend/dist` directory. Deploy these files to your server and ensure the following:
1. Set up environment variables
2. Configure MongoDB connection
3. Set up proper security measures (HTTPS, secure headers, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
