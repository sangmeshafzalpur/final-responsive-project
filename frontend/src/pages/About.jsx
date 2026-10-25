import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">About Project</h1>
        <p className="mt-4 text-xl text-gray-600">ChilliFusionNet: AI-Powered Agricultural Intelligence</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Project Objective</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            The primary objective of ChilliFusionNet is to provide an accessible, highly accurate, and rapid disease detection system for chilli farmers. By leveraging advanced deep learning techniques, this final-year project aims to reduce crop loss and promote sustainable agricultural practices through early intervention.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">AI Technology</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            The core intelligence of this system is built upon a hybrid deep learning architecture:
          </p>
          <ul className="list-disc pl-6 text-gray-600 leading-relaxed space-y-2 text-lg">
            <li><strong>EfficientNetB4:</strong> A highly efficient convolutional neural network that extracts complex visual features from chilli leaf images with optimal computational resource usage.</li>
            <li><strong>CBAM (Convolutional Block Attention Module):</strong> An attention mechanism that helps the model focus on the most critical parts of the image (e.g., disease spots) while ignoring background noise.</li>
            <li><strong>BiLSTM (Bidirectional Long Short-Term Memory):</strong> A sequential layer that processes the extracted features bidirectionally, capturing complex spatial relationships within the leaf structure.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Explainable AI (XAI)</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            To build trust with end-users, ChilliFusionNet incorporates Grad-CAM (Gradient-weighted Class Activation Mapping). This technique visualizes the regions of the image that strongly influenced the AI's prediction, providing transparency into the model's decision-making process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Future Scope</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900">Mobile Application</h3>
              <p className="text-sm text-gray-600 mt-1">Native mobile app for offline and on-field diagnosis.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900">Real-Time Field Diagnosis</h3>
              <p className="text-sm text-gray-600 mt-1">Integration with drone or robotic camera feeds.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900">Multilingual Support</h3>
              <p className="text-sm text-gray-600 mt-1">Local language support for rural farmers.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900">IoT Integration</h3>
              <p className="text-sm text-gray-600 mt-1">Connecting with soil sensors and weather data for holistic analysis.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
