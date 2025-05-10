'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import AuthModal from './AuthModal';

interface LandingScreenProps {
  onAuthSuccess: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAuthSuccess }) => {
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [titleHover, setTitleHover] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen bg-terminal-black text-terminal-text font-mono overflow-hidden">
      {/* Soft glow effect */}
      {/* <div className="absolute inset-0 bg-gradient-radial from-terminal-black/50 to-terminal-black pointer-events-none" /> */}
      
      {/* Scanline effect */}
      {/* <div className="absolute inset-0 bg-scanlines opacity-10 mix-blend-overlay pointer-events-none" /> */}
      
      {/* Subtle vignette */}
      {/* <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-30 pointer-events-none" /> */}

      <div className="text-center z-10 px-4">
        <h1 
          className={`text-6xl md:text-7xl mb-6 tracking-wider ${titleHover ? 'animate-glitch' : 'animate-flicker'} transition-all duration-300`}
          style={{ 
            textShadow: titleHover ? '0 0 15px #00ffe0, 0 0 20px #00ffe0' : '0 0 5px #00ffe0',
            color: '#e0e0e0'
          }}
          onMouseEnter={() => setTitleHover(true)}
          onMouseLeave={() => setTitleHover(false)}
        >
          PROJECT SILKROAD
        </h1>
        
        <p className="text-lg mb-8 text-terminal-cyan opacity-80 tracking-wide">
          <span className="inline-block mr-2">↯</span> 
          ACCESS TO THE NETWORK REQUIRES CLEARANCE
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-64 px-6 py-3 bg-terminal-black border border-terminal-cyan text-terminal-cyan font-mono rounded-sm 
                      hover:bg-terminal-cyan/10 hover:shadow-[0_0_15px_rgba(0,255,224,0.5)] transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-terminal-cyan focus:ring-opacity-50"
            tabIndex={0}
          >
            <span className="mr-2">&gt;</span>ACCESS_NETWORK
          </button>

          <button
            onClick={() => setIsLoreModalOpen(true)}
            className="w-64 px-6 py-3 bg-terminal-black border border-terminal-magenta text-terminal-magenta font-mono rounded-sm
                      hover:bg-terminal-magenta/10 hover:shadow-[0_0_15px_rgba(255,0,128,0.5)] transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-terminal-magenta focus:ring-opacity-50"
            tabIndex={0}
          >
            <span className="mr-2">&gt;</span>READ_MANIFESTO
          </button>
        </div>
      </div>

      {/* Lore Modal */}
      <Dialog
        open={isLoreModalOpen}
        onClose={() => setIsLoreModalOpen(false)}
        className="fixed inset-0 z-20 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        
        <div className="relative bg-terminal-black border border-terminal-magenta text-terminal-text p-6 rounded-sm shadow-[0_0_30px_rgba(255,0,128,0.3)] max-w-md mx-auto animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-1 bg-terminal-magenta"></div>
          
          <Dialog.Title className="text-xl font-bold mb-4 text-terminal-magenta">
            <span className="mr-2">&gt;</span>MANIFESTO.txt
          </Dialog.Title>
          
          <Dialog.Description className="text-sm leading-relaxed border-l-2 border-terminal-magenta/30 pl-4 my-4">
            The Silkroad is not a place. It's a protocol. An evolution of commerce beyond states.
            <br /><br />
            We are building the infrastructure for a new economic paradigm. One that cannot be controlled, regulated, or shut down.
            <br /><br />
            Join us. The future is decentralized.
          </Dialog.Description>
          
          <button
            onClick={() => setIsLoreModalOpen(false)}
            className="mt-4 px-4 py-2 bg-terminal-black border border-terminal-magenta text-terminal-magenta font-mono rounded-sm
                      hover:bg-terminal-magenta/10 transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-terminal-magenta"
          >
            <span className="mr-2">&gt;</span>CLOSE
          </button>
        </div>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={onAuthSuccess} 
      />
    </div>
  );
};

export default LandingScreen;
