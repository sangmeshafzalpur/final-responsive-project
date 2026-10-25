import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const PredictionCard = ({ prediction }) => {
  const isHealthy = prediction.class_name.toLowerCase() === 'healthy';
  const confidencePercent = (prediction.confidence * 100).toFixed(2);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center h-full"
    >
      <div className="mb-4">
        {isHealthy ? (
          <div className="w-20 h-20 bg-green-100 text-chilli-primary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} />
          </div>
        ) : (
          <div className="w-20 h-20 bg-red-100 text-chilli-red rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={40} />
          </div>
        )}
      </div>
      
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Predicted Disease</p>
      <h3 className={`text-2xl font-bold mb-4 capitalize ${isHealthy ? 'text-chilli-primary' : 'text-chilli-red'}`}>
        {prediction.class_name.replace(/_/g, ' ')}
      </h3>
      
      <div className="w-full flex justify-center mb-2">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <motion.circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke={isHealthy ? "#2E7D32" : "#D32F2F"} 
              strokeWidth="10" 
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * prediction.confidence) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-gray-800">{confidencePercent}%</span>
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-2">Confidence</p>
      
      <div className={`mt-6 px-4 py-2 rounded-full text-sm font-medium ${
        isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        Status: {prediction.risk_level}
      </div>
    </motion.div>
  );
};

export default PredictionCard;
