import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Network, Activity, Cpu } from 'lucide-react';

const Model = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Model Architecture
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          ChilliFusionNet: EfficientNetB4 + CBAM + BiLSTM
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Cpu className="text-chilli-primary" /> Model Specifications
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Model Name</span>
              <span className="text-gray-900 font-bold">ChilliFusionNet</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Base Architecture</span>
              <span className="text-gray-900 font-bold">EfficientNetB4</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Attention Mechanism</span>
              <span className="text-gray-900 font-bold">CBAM</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Sequential Layer</span>
              <span className="text-gray-900 font-bold">BiLSTM</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Input Size</span>
              <span className="text-gray-900 font-bold">380 × 380</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 font-medium">Classes</span>
              <span className="text-gray-900 font-bold">5</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="text-chilli-primary" /> Training Details
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Initial Epochs</span>
              <span className="text-gray-900 font-bold">10</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Fine-Tuning Epochs</span>
              <span className="text-gray-900 font-bold">50</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span className="text-gray-600 font-medium">Total Epochs</span>
              <span className="text-gray-900 font-bold">60</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600 font-medium">EarlyStopping</span>
              <span className="text-gray-900 font-bold text-red-500">OFF</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex justify-center items-center gap-2">
          <Network className="text-chilli-primary" /> Architecture Flow
        </h2>
        
        <div className="flex flex-col items-center max-w-2xl mx-auto space-y-4 relative">
          <FlowBlock title="Input Image" desc="380x380 RGB Chilli Leaf" delay={0.1} />
          <FlowArrow />
          <FlowBlock title="EfficientNetB4" desc="Deep Feature Extraction" delay={0.2} color="bg-blue-50" />
          <FlowArrow />
          <FlowBlock title="CBAM" desc="Convolutional Block Attention Module" delay={0.3} color="bg-purple-50" />
          <FlowArrow />
          <FlowBlock title="Spatial Feature Sequence" desc="Reshape for sequence processing" delay={0.4} />
          <FlowArrow />
          <FlowBlock title="BiLSTM" desc="Bidirectional Long Short-Term Memory" delay={0.5} color="bg-indigo-50" />
          <FlowArrow />
          <FlowBlock title="Classification Head" desc="Dense Layers + Softmax" delay={0.6} />
          <FlowArrow />
          <FlowBlock title="Disease Prediction" desc="5 Classes" delay={0.7} color="bg-green-50 text-chilli-primary border-chilli-primary" />
        </div>
      </div>
    </div>
  );
};

const FlowBlock = ({ title, desc, delay, color = "bg-gray-50 border-gray-200" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`w-full max-w-sm rounded-xl border-2 p-4 shadow-sm z-10 ${color}`}
  >
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm opacity-80">{desc}</p>
  </motion.div>
);

const FlowArrow = () => (
  <div className="h-6 w-0.5 bg-gray-300 relative">
    <div className="absolute -bottom-1 -left-1.5 w-3 h-3 border-r-2 border-b-2 border-gray-300 transform rotate-45"></div>
  </div>
);

export default Model;
