'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "../firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin"); // 'signin' or 'signup'
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && isOpen) {
        // Let the default tab behavior work, but we're listening for it
      } else if (e.key === 'Enter' && document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Progress bar animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      setProgressValue(0);
      interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Cap at 90% until actual completion
          }
          return prev + 10;
        });
      }, 200);
    } else if (progressValue > 0) {
      // When loading completes, finish the progress bar
      setProgressValue(100);
      interval = setInterval(() => {
        setProgressValue(0);
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("ESTABLISHING SECURE CONNECTION...");
    setIsLoading(true);

    const auth = getAuth(app);

    try {
      await setPersistence(auth, browserLocalPersistence);

      if (mode === "signin") {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Signed in:", userCred.user);
        setStatus("ACCESS GRANTED");
        setTimeout(() => {
          onAuthSuccess(); // Notify parent component
          onClose(); // Close modal
        }, 1000); // Delay to show success message
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Account created:", userCred.user);
        setStatus("IDENTITY REGISTERED");
        setTimeout(() => {
          onAuthSuccess(); // Notify parent component
          onClose(); // Close modal
        }, 1000); // Delay to show success message
      }
    } catch (err: any) {
      console.error("❌ Auth error:", err);
      setIsLoading(false);
      
      if (err.code === "auth/invalid-email") {
        setError("[ACCESS DENIED] Invalid email format detected.");
      } else if (err.code === "auth/user-not-found") {
        setError("[ACCESS DENIED] Identity not found in database.");
      } else if (err.code === "auth/wrong-password") {
        setError("[ACCESS DENIED] Authentication key mismatch.");
      } else if (err.code === "auth/invalid-credential") {
        setError("[ACCESS DENIED] Invalid credentials provided.");
      } else {
        setError("[SYSTEM ERROR] Authentication protocol failure. Retry sequence.");
      }
      setStatus(null);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => !isLoading && onClose()} 
      className="fixed inset-0 z-30 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

        <div className={`relative bg-terminal-black border border-terminal-cyan text-terminal-text 
                        max-w-md w-full mx-auto p-6 rounded-sm shadow-[0_0_30px_rgba(0,255,224,0.3)] 
                        font-mono animate-slideUp overflow-hidden`}>
          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-terminal-cyan"></div>
          
          {/* Progress bar */}
          {progressValue > 0 && (
            <div className="absolute top-1 left-0 h-0.5 bg-terminal-cyan transition-all duration-300" 
                 style={{ width: `${progressValue}%` }}></div>
          )}
          
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-scanlines opacity-5 mix-blend-overlay pointer-events-none" />

          <Dialog.Title className="text-xl font-bold mb-4 text-terminal-cyan flex items-center">
            <span className="mr-2">&gt;</span>
            NETWORK_AUTH.SYS
          </Dialog.Title>
          
          {/* Mode toggle tabs */}
          <div className="flex mb-6 border-b border-terminal-cyan/30">
            <button
              onClick={() => setMode("signin")}
              className={`px-4 py-2 text-sm transition-all duration-200 focus:outline-none ${
                mode === "signin" 
                  ? "text-terminal-cyan border-b-2 border-terminal-cyan" 
                  : "text-terminal-text/70 hover:text-terminal-text"
              }`}
            >
              SIGN_IN
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-4 py-2 text-sm transition-all duration-200 focus:outline-none ${
                mode === "signup" 
                  ? "text-terminal-cyan border-b-2 border-terminal-cyan" 
                  : "text-terminal-text/70 hover:text-terminal-text"
              }`}
            >
              SIGN_UP
            </button>
          </div>

          <Dialog.Description className="text-sm text-terminal-text/80 mb-4">
            {mode === "signin" 
              ? "ENTER CREDENTIALS TO ACCESS SECURE NETWORK" 
              : "REGISTER NEW IDENTITY IN THE SYSTEM"}
          </Dialog.Description>

          {status && (
            <div className={`text-terminal-cyan text-sm my-3 ${isLoading ? 'animate-pulse' : ''}`}>
              <span className="inline-block mr-2">&gt;</span>{status}
            </div>
          )}
          
          {error && (
            <div className="text-terminal-error text-sm my-3 border-l-2 border-terminal-error pl-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-terminal-text/80 text-xs mb-1">IDENTITY</label>
              <input
                type="email"
                placeholder="user@domain.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-terminal-black border-b-2 border-terminal-cyan/50 
                          text-terminal-text focus:border-terminal-cyan focus:outline-none transition-all
                          placeholder:text-terminal-text/30"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-terminal-text/80 text-xs mb-1">ACCESS_KEY</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-terminal-black border-b-2 border-terminal-cyan/50 
                          text-terminal-text focus:border-terminal-cyan focus:outline-none transition-all
                          placeholder:text-terminal-text/30"
                required
                disabled={isLoading}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-terminal-black border border-terminal-cyan text-terminal-cyan 
                        font-mono rounded-sm hover:bg-terminal-cyan/10 transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-terminal-cyan focus:ring-opacity-50
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">&gt;</span>
              {mode === "signin" ? "AUTHENTICATE" : "REGISTER"}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-terminal-cyan/70 text-sm hover:text-terminal-cyan focus:outline-none"
              disabled={isLoading}
            >
              {mode === "signin" ? "CREATE_NEW_IDENTITY" : "USE_EXISTING_IDENTITY"}
            </button>

            <button
              onClick={onClose}
              className="text-terminal-text/70 text-sm hover:text-terminal-text focus:outline-none"
              disabled={isLoading}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AuthModal;
