import React, { useState } from 'react';
import ProjectsManager from '../../components/admin/ProjectsManager';
import InquiriesManager from '../../components/admin/InquiriesManager';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inquiries');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container-custom py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'inquiries'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Inquiries
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'projects'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Projects
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'inquiries' && <InquiriesManager />}
            {activeTab === 'projects' && <ProjectsManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 