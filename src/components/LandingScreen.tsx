import React from 'react';
import { Dialog, DialogTrigger, DialogContent } from "@shadcn/ui";

const LandingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-mono mb-4">PROJECT SILKROAD</h1>
        <p className="text-lg mb-6">Access to the network requires verification</p>
        <Dialog>
          <DialogTrigger>
            <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">
              Access Network
            </button>
          </DialogTrigger>
          <DialogContent>
            <div className="p-4">
              <h2 className="text-xl font-bold">Authentication Modal</h2>
              <p>Modal content goes here...</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LandingScreen;
