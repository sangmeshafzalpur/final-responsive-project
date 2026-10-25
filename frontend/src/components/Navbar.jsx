import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Detection', path: '/detection' },
    { name: 'Model', path: '/model' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'History', path: '/history' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-chilli-light text-chilli-primary">
                <Leaf size={20} />
              </div>
              <span className="font-bold text-xl text-gray-800">ChilliFusionNet</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'text-chilli-primary font-semibold'
                    : 'text-gray-600 hover:text-chilli-primary'
                } transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/detection"
              className="bg-chilli-primary hover:bg-green-800 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Start Diagnosis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-chilli-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-chilli-primary bg-chilli-light'
                    : 'text-gray-600 hover:text-chilli-primary hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/detection"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 bg-chilli-primary text-white px-5 py-2 rounded-md font-medium"
            >
              Start Diagnosis
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
