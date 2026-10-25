import React from 'react';

const ChilliLoader = ({ text = "ChilliFusionNet is analyzing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
        {/* Glowing background circles */}
        <div className="absolute inset-0 bg-chilli-red/20 rounded-full blur-xl pulse-circle"></div>
        <div className="absolute inset-4 bg-chilli-primary/20 rounded-full blur-md pulse-circle" style={{ animationDelay: '0.5s' }}></div>
        
        {/* SVG Chilli */}
        <div className="chilli-loader relative z-10 chilli-glow">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 20 C48 10 52 10 52 20 Z" fill="#2E7D32"/>
            <path d="M50 25 C75 25 80 50 70 70 C60 90 40 95 30 90 C15 80 15 45 30 35 C40 25 50 25 50 25 Z" fill="#D32F2F"/>
          </svg>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{text}</h3>
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-gradient-to-r from-chilli-primary to-chilli-red rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default ChilliLoader;
