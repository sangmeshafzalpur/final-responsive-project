import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, Activity, Zap, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-chilli-light to-white pt-16 pb-32">
        {/* Abstract Background Elements */}
        <div className="absolute top-20 right-0 -mr-20 w-72 h-72 bg-chilli-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-chilli-primary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mt-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6"
            >
              Smart Chilli Plant <br/>
              <span className="text-chilli-primary">Disease Detection</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Empowering chilli farmers with AI-powered plant health analysis using ChilliFusionNet.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <Link 
                to="/detection" 
                className="px-8 py-4 w-full sm:w-auto text-lg font-medium rounded-full text-white bg-chilli-primary hover:bg-green-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Start Diagnosis
              </Link>
              <Link 
                to="/model" 
                className="px-8 py-4 w-full sm:w-auto text-lg font-medium rounded-full text-chilli-primary bg-chilli-light hover:bg-green-100 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Advanced AI analysis in four simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<UploadCloud className="text-chilli-primary" size={32} />}
              title="01. Upload"
              description="Upload a clear image of a chilli leaf."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Zap className="text-chilli-red" size={32} />}
              title="02. Preprocess"
              description="The backend prepares the image for the model."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Activity className="text-chilli-primary" size={32} />}
              title="03. Analyze"
              description="ChilliFusionNet extracts visual features and classifies."
              delay={0.3}
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-chilli-red" size={32} />}
              title="04. Predict"
              description="Receive disease class, confidence, and explainability."
              delay={0.4}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Home;
