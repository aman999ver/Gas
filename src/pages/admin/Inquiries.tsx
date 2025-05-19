import React from 'react';
import { motion } from 'framer-motion';
import InquiriesManager from '../../components/admin/InquiriesManager';

const Inquiries: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-100 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Inquiries Management</h1>
            <InquiriesManager />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Inquiries; 