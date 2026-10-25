import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('chilli_history') || '[]');
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDelete = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('chilli_history', JSON.stringify(newHistory));
  };

  const handleClearAll = () => {
    setHistory([]);
    localStorage.setItem('chilli_history', '[]');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Prediction History</h1>
          <p className="mt-2 text-gray-600">Your recent disease detection results</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">No prediction history available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
                {item.image ? (
                  <img src={item.image} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                )}
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <p className="text-sm text-gray-500 mb-1">{new Date(item.date).toLocaleString()}</p>
                <h3 className="text-xl font-bold text-gray-900 capitalize mb-1">
                  {item.prediction.class_name.replace(/_/g, ' ')}
                </h3>
                <div className="flex flex-col sm:flex-row items-center sm:gap-4 mt-2">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                    Confidence: {(item.prediction.confidence * 100).toFixed(1)}%
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full mt-2 sm:mt-0 ${
                    item.prediction.class_name.toLowerCase() === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.prediction.risk_level}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-500 p-2 transition-colors shrink-0"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
