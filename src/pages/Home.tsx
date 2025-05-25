/// <reference types="node" />
/// <reference types="react" />
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import { AppWindowMac, Code, MonitorCog } from "lucide-react";
import { LucideIcon } from 'lucide-react';


interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  category: string;
}

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 ml-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

const stats = [
  { value: '100+', label: 'Projects Completed' },
  { value: '50+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '24/7', label: 'Support' },
];


const features: Feature[] = [
  {
    title: 'Custom Development',
    description: 'Tailored solutions built specifically for your business needs.',
    icon: Code,
  },
  {
    title: 'Modern Design',
    description: 'Beautiful, responsive interfaces that work on all devices.',
    icon: AppWindowMac,
  },
  {
    title: 'Performance First',
    description: 'Optimized applications that load fast and run smoothly.',
    icon: MonitorCog,
  },
];

const process = [
  {
    title: 'Discovery',
    description: 'We learn about your business and project requirements.',
  },
  {
    title: 'Planning',
    description: 'Detailed project roadmap and technical specifications.',
  },
  {
    title: 'Development',
    description: 'Agile development with regular updates and feedback.',
  },
  {
    title: 'Launch',
    description: 'Thorough testing and successful project deployment.',
  },
];

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>(`${config.apiUrl}/api/projects`);
        setProjects(response.data.filter(project => project.category === 'featured').slice(0, 3));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your Ideas Into Digital Reality
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed">
                We are GAS Genius Apps Solutions, your trusted partner in building innovative
                digital solutions that drive business growth and success.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
                <Link
                  to="/services"
                  className="btn-primary border-2 border-white hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all"
                >
                  Our Services
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
             <div className="relative flex justify-center items-center py-12 px-4">
            {/* Decorative Rotated Blurred Layer */}
            <div className="absolute inset-0 mx-auto max-w-sm bg-white/10 rounded-xl backdrop-blur-sm transform rotate-6 z-0"></div>

            {/* Foreground Card with Image */}
            <div className="relative z-10 bg-white/20 rounded-xl backdrop-blur-md p-10 flex justify-center items-center shadow-md">
              <img
                src="/assets/images/logo3.png"
                alt="Digital Innovation"
                className="w-40 h-40 object-cover rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:rotate-6"
              />
            </div>
          </div>
                        
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We combine technical expertise with creative innovation to deliver
              exceptional digital solutions that help your business thrive.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-600 mb-4">
                  <feature.icon />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We follow a proven development process to ensure your project is delivered
              on time and exceeds expectations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-100"></div>
                )}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore some of our recent work that showcases our expertise and
              commitment to excellence.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              View All Projects
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Let's discuss your project and turn your vision into reality. Our team is
              ready to help you succeed.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-primary-900 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all"
            >
              Contact Us Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 