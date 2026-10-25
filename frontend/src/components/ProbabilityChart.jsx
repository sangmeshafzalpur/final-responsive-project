import React from 'react';
import { motion } from 'framer-motion';

const ProbabilityChart = ({ probabilities, predictedClass }) => {
  // Sort probabilities descending
  const sortedProbs = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a)
    .map(([className, prob]) => ({
      name: className.replace(/_/g, ' '),
      probability: prob,
      isPredicted: className === predictedClass
    }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Probability Distribution</h3>
      
      <div className="space-y-4">
        {sortedProbs.map((item, index) => (
          <div key={item.name} className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className={`font-medium capitalize ${item.isPredicted ? 'text-chilli-primary' : 'text-gray-700'}`}>
                {item.name}
              </span>
              <span className="text-gray-500 font-medium">
                {(item.probability * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.probability * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  item.isPredicted 
                    ? (item.name.toLowerCase() === 'healthy' ? 'bg-chilli-primary' : 'bg-chilli-red')
                    : 'bg-gray-300'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProbabilityChart;
