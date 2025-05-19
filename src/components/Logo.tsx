import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center ${className}`}
    >
      <img
        src="/assets/images/logo3.png"
        alt="GAS Genius Logo"
        className="h-12 w-auto"
      />
    </motion.div>
  );
};

export default Logo; 