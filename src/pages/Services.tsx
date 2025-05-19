import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      {/* Header */}
      <div className="container-custom mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-6">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive digital solutions tailored to your business needs.
            From web development to custom software, we've got you covered.
          </p>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="text-primary-600 mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-block btn-primary"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-primary-600 text-white rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="mb-8">
            Contact us today to discuss how we can help bring your vision to life.
          </p>
          <Link
            to="/contact"
            className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const services = [
  {
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Web Development',
    description:
      'Create stunning, responsive websites that engage your audience and drive conversions.',
    features: [
      'Custom Website Design',
      'E-commerce Solutions',
      'Progressive Web Apps',
      'CMS Integration',
      'Performance Optimization',
    ],
  },
  {
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Mobile App Development',
    description:
      'Build powerful mobile applications that provide seamless user experiences across platforms.',
    features: [
      'iOS Development',
      'Android Development',
      'Cross-platform Solutions',
      'App Store Optimization',
      'Mobile UI/UX Design',
    ],
  },
  {
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    title: 'Custom Software Development',
    description:
      'Develop tailored software solutions that streamline your business operations.',
    features: [
      'Enterprise Software',
      'Cloud Solutions',
      'API Development',
      'Database Design',
      'System Integration',
    ],
  },
  {
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Digital Transformation',
    description:
      'Transform your business with cutting-edge digital solutions and strategies.',
    features: [
      'Digital Strategy Consulting',
      'Process Automation',
      'Legacy System Modernization',
      'Cloud Migration',
      'Technology Assessment',
    ],
  },
];

export default Services; 