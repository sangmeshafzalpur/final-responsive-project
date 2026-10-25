import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-chilli-light text-chilli-primary">
                <Leaf size={20} />
              </div>
              <span className="font-bold text-xl text-gray-800">ChilliFusionNet</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-sm">
              AI-powered chilli plant disease detection system using advanced deep learning architecture.
            </p>
            <p className="text-sm text-gray-500 font-medium">
              Developed as a Final Year Project
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-chilli-primary">Home</Link></li>
              <li><Link to="/detection" className="text-gray-600 hover:text-chilli-primary">Detection</Link></li>
              <li><Link to="/model" className="text-gray-600 hover:text-chilli-primary">Model Info</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-chilli-primary">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Technology</h3>
            <ul className="space-y-2 text-gray-600">
              <li>EfficientNetB4</li>
              <li>CBAM Attention</li>
              <li>BiLSTM</li>
              <li>FastAPI & React</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ChilliFusionNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
