import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Info } from 'lucide-react';

const diseaseInfoData = {
  'healthy': {
    name: 'Healthy',
    description: 'Your chilli plant appears healthy based on the uploaded image.',
    symptoms: 'None.',
    guidance: 'Continue regular watering, ensure adequate sunlight, and maintain good soil nutrition.'
  },
  'cercospora': {
    name: 'Cercospora Leaf Spot',
    description: 'A fungal disease that affects chilli leaves, causing circular or irregular spots with light gray centers and dark margins.',
    symptoms: 'Small circular spots, often with a "frog-eye" appearance. Severe infection can lead to leaf drop.',
    guidance: 'Improve air circulation, avoid overhead watering, and remove infected plant debris. Consider appropriate fungicides if severe.'
  },
  'mites_and_trips': {
    name: 'Mites and Thrips',
    description: 'Tiny insect pests that feed on plant sap, causing leaf distortion and reduced yield.',
    symptoms: 'Upward or downward curling of leaves, silvery or bronzed appearance on the underside, stunted growth.',
    guidance: 'Maintain adequate humidity. Use insecticidal soaps or neem oil. Encourage natural predators.'
  },
  'nutritional': {
    name: 'Nutritional Deficiency',
    description: 'Plant suffering from a lack of essential nutrients (like Nitrogen, Potassium, or Magnesium).',
    symptoms: 'Yellowing of leaves (chlorosis), stunted growth, poor fruit development.',
    guidance: 'Test soil pH and nutrient levels. Apply a balanced fertilizer or specific amendments based on the deficiency.'
  },
  'powdery mildew': {
    name: 'Powdery Mildew',
    description: 'A fungal infection that appears as a white, powdery growth on leaf surfaces.',
    symptoms: 'White powdery spots on leaves, stems. Leaves may eventually turn yellow and drop off.',
    guidance: 'Ensure good air circulation and sunlight. Avoid wetting foliage. Use sulfur-based or appropriate organic fungicides.'
  }
};

const DiseaseInfoCard = ({ className }) => {
  const normalizedClass = className.toLowerCase();
  const info = diseaseInfoData[normalizedClass] || {
    name: className,
    description: 'Information for this disease is currently unavailable.',
    symptoms: 'N/A',
    guidance: 'Consult a local agricultural expert.'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Leaf className="text-chilli-primary" size={20} />
        Disease Information
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-700">Disease Name</h4>
          <p className="text-gray-900 font-medium capitalize">{info.name}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-bold text-gray-700">Description</h4>
          <p className="text-gray-600 text-sm">{info.description}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-bold text-gray-700">Visual Symptoms</h4>
          <p className="text-gray-600 text-sm">{info.symptoms}</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 mt-2">
          <h4 className="text-sm font-bold text-blue-900 flex items-center gap-1 mb-1">
            <Info size={14} /> General Guidance
          </h4>
          <p className="text-blue-800 text-sm">{info.guidance}</p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseInfoCard;
