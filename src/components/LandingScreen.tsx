import React, { useState } from 'react';
import AuthModal from './AuthModal';

const LandingScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-mono mb-4">PROJECT SILKROAD</h1>
        <p className="text-lg mb-6">Access to the network requires verification</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Access Network
        </button>
        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};

export default LandingScreen;
