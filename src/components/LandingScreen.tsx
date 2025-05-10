'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import AuthModal from './AuthModal';

interface LandingScreenProps {
  onAuthSuccess: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAuthSuccess }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center h-screen bg-black text-neon-green font-mono">
      {/* Animated scanline overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-transparent opacity-10 animate-pulse pointer-events-none" />

      <div className="text-center z-10">
        <h1 className="text-6xl mb-4 text-cyan-400">PROJECT SILKROAD</h1>
        <p className="text-lg mb-6 text-magenta-400">↯ Enter the Silkroad Network</p>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 bg-neon-green text-black font-semibold rounded hover:shadow-[0_0_10px_#39ff14] animate-pulse"
        >
          Access Network
        </button>

        <button
          onClick={() => setIsLoreModalOpen(true)}
          className="mt-4 px-6 py-3 bg-gray-900 text-cyan-400 font-semibold rounded hover:shadow-[0_0_10px_#00ffff]"
        >
          Read Manifesto
        </button>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={onAuthSuccess}
        />

        {/* Lore Modal */}
        <Dialog
          open={isLoreModalOpen}
          onClose={() => setIsLoreModalOpen(false)}
          className="fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="bg-gray-900 text-neon-green p-6 rounded shadow-lg max-w-md">
            <Dialog.Title className="text-xl font-bold mb-4">Manifesto</Dialog.Title>
            <Dialog.Description className="text-sm">
              The Silkroad is not a place. It's a protocol. An evolution.
            </Dialog.Description>
            <button
              onClick={() => setIsLoreModalOpen(false)}
              className="mt-4 px-4 py-2 bg-neon-green text-black font-bold rounded hover:shadow-[0_0_10px_#39ff14]"
            >
              Close
            </button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default LandingScreen;
