import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictDisease } from '../services/api';
import UploadCard from '../components/UploadCard';
import ChilliLoader from '../components/ChilliLoader';
import PredictionCard from '../components/PredictionCard';
import ProbabilityChart from '../components/ProbabilityChart';
import DiseaseInfoCard from '../components/DiseaseInfoCard';
import GradCAMViewer from '../components/GradCAMViewer';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Detection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await predictDisease(file, true);
      if (response.data && response.data.success) {
        setResult(response.data);
        
        // Save to history (localStorage)
        try {
          const history = JSON.parse(localStorage.getItem('chilli_history') || '[]');
          history.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            prediction: response.data.prediction,
            image: response.data.original_image
          });
          // keep last 20
          localStorage.setItem('chilli_history', JSON.stringify(history.slice(0, 20)));
        } catch (e) {
          console.error("Could not save to history", e);
        }
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Backend service is unavailable. Please make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex flex-col">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Disease Detection Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a clear image of a chilli leaf and let ChilliFusionNet analyze its health.
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!loading && !result && !error && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <UploadCard onAnalyze={handleAnalyze} />
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full flex justify-center py-20"
            >
              <ChilliLoader text="ChilliFusionNet is analyzing your image..." />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
            >
              <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-red-800 mb-2">Analysis Failed</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={handleReset}
                className="bg-white text-red-700 border border-red-200 hover:bg-red-50 px-6 py-2 rounded-full font-medium transition-colors shadow-sm"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-chilli-primary hover:text-green-800 font-medium"
                >
                  <RefreshCw size={18} /> Analyze Another
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1">
                  <PredictionCard prediction={result.prediction} />
                </div>
                <div className="lg:col-span-2">
                  <ProbabilityChart 
                    probabilities={result.probabilities} 
                    predictedClass={result.prediction.class_name} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <GradCAMViewer 
                    originalImage={result.original_image}
                    heatmap={result.gradcam_heatmap}
                    overlay={result.gradcam_overlay}
                  />
                </div>
                <div>
                  <DiseaseInfoCard className={result.prediction.class_name} />
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-8 pb-8">
                Processed by {result.model.name} ({result.model.architecture}) in {result.processing_time_ms}ms
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Detection;
