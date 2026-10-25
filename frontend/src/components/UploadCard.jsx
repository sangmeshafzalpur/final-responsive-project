import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadCard = ({ onAnalyze }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      setError("Please upload a valid image file (JPG, PNG, WebP) under 5MB.");
      return;
    }
    
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze(file, preview);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-chilli-light text-chilli-primary mb-4">
          <Upload size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Upload Chilli Leaf Image</h2>
        <p className="text-gray-500 mt-2">Upload a clear image for ChilliFusionNet to analyze</p>
      </div>

      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-chilli-primary bg-chilli-light/50' : 'border-gray-300 hover:border-chilli-primary hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? "Drop the image here" : "Drag & drop your image here"}
          </p>
          <p className="text-gray-500 mt-2">or click to browse</p>
          <p className="text-xs text-gray-400 mt-4">Supports JPG, PNG, WebP (Max 5MB)</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-50 rounded-xl p-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-300 shadow-sm shrink-0">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h3 className="font-semibold text-gray-800 truncate mb-1">{file.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              
              <button 
                onClick={handleAnalyze}
                className="w-full md:w-auto bg-chilli-primary hover:bg-green-800 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Zap size={18} />
                Analyze Image
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default UploadCard;
