import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const GradCAMViewer = ({ originalImage, heatmap, overlay }) => {
  const [activeTab, setActiveTab] = useState('overlay'); // 'original', 'heatmap', 'overlay'
  
  if (!originalImage || !overlay) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Explainable AI</h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Info size={14} /> Heatmap regions contributed most to prediction.
          </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
              activeTab === 'original' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
              activeTab === 'heatmap' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveTab('overlay')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
              activeTab === 'overlay' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overlay
          </button>
        </div>
      </div>
      
      <div className="flex justify-center h-64">
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-w-sm w-full h-full flex items-center justify-center">
          {activeTab === 'original' && (
            <motion.img 
              key="original"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={originalImage} 
              alt="Original" 
              className="max-w-full max-h-full object-contain"
            />
          )}
          {activeTab === 'heatmap' && (
            <motion.img 
              key="heatmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={heatmap} 
              alt="Heatmap" 
              className="max-w-full max-h-full object-contain"
            />
          )}
          {activeTab === 'overlay' && (
            <motion.img 
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={overlay} 
              alt="Overlay" 
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GradCAMViewer;
